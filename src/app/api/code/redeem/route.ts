import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/route';
import { withDb } from '@/lib/withDb';
import Code from '@/models/code';
import UserStats from '@/models/userStats';
import UserPremium from '@/models/userPremium';

export const POST = withDb(async (req: NextRequest) => {
    try {
        const session = await getServerSession(authOptions);
        
        if (!session?.user?.id) {
            return NextResponse.json(
                { success: false, message: 'Unauthorized' },
                { status: 401 }
            );
        }

        const { code: inputCode } = await req.json();

        if (!inputCode || typeof inputCode !== 'string') {
            return NextResponse.json(
                { success: false, message: 'Code is required' },
                { status: 400 }
            );
        }

        // Kodu database'den bul
        const codeDoc = await Code.findOne({ code: inputCode.toUpperCase() });
        
        if (!codeDoc) {
            return NextResponse.json(
                { success: false, message: 'Invalid code' },
                { status: 404 }
            );
        }

        // Usage limit kontrolü
        if (codeDoc.usedCount >= (codeDoc.usageLimit || 1)) {
            return NextResponse.json(
                { success: false, message: 'Code usage limit exceeded' },
                { status: 400 }
            );
        }

        const userId = session.user.id;

        // UserStats'a kredi ekle
        if (codeDoc.credit > 0) {
            await UserStats.findOneAndUpdate(
                { _id: userId },
                { $inc: { credit: codeDoc.credit } },
                { upsert: true, new: true }
            );
        }

        // Premium işlemleri
        if (codeDoc.premium && codeDoc.premiumDays > 0) {
            const currentDate = new Date();
            const expiresAt = new Date(currentDate.getTime() + (codeDoc.premiumDays * 24 * 60 * 60 * 1000));
            
            await UserPremium.findOneAndUpdate(
                { _id: userId },
                { 
                    premium: true,
                    premium_expires_at: expiresAt,
                    premium_plan: 'premium'
                },
                { upsert: true, new: true }
            );
        }

        // UsedCount'u artır
        codeDoc.usedCount += 1;
        await codeDoc.save();

        // Usage limit dolmuşsa kodu sil
        if (codeDoc.usedCount >= (codeDoc.usageLimit || 1)) {
            await Code.findByIdAndDelete(codeDoc._id);
        }

        return NextResponse.json({
            success: true,
            message: 'Code redeemed successfully',
            data: {
                credit: codeDoc.credit,
                premium: codeDoc.premium,
                premiumDays: codeDoc.premiumDays
            }
        });

    } catch (error) {
        console.error('Error redeeming code:', error);
        return NextResponse.json(
            { success: false, message: 'Internal server error' },
            { status: 500 }
        );
    }
}); 