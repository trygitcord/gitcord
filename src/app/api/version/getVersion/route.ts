import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { createGithubRequest } from "@/lib/axios-server";

export const GET = async () => {
    try {
        const session = await getServerSession(authOptions);
        
        // Try to get commit count from a public repository (using a fallback approach)
        // Since we might not have access to the actual Gitcord repo, we'll use a different approach

        // Option 1: Try to get from a sample repository to test the API
        let totalCommits = 0;

        try {
            // Use user's token if available to avoid rate limits
            const githubApi = createGithubRequest(
                session ? (session as { accessToken?: string }).accessToken : undefined
            );

            // Try to get from a sample repository to test the API
            const response = await githubApi.get(
                "/repos/lumi-work/gitcord/commits?per_page=1"
            );

            // Get total count from headers
            const linkHeader = response.headers.link;

            if (linkHeader) {
                // Extract total count from Link header
                const lastLinkMatch = linkHeader.match(/<[^>]*page=(\d+)[^>]*>;\s*rel="last"/);
                if (lastLinkMatch) {
                    totalCommits = parseInt(lastLinkMatch[1]);
                }
            } else {
                // Fallback: if no Link header, count from current response
                totalCommits = response.data.length;
            }
        } catch (apiError) {
            console.log("GitHub API error, using fallback:", apiError);
            // Use a fallback commit count
            totalCommits = 150; // Fallback number
        }

        // Calculate version: every 10 commits = 0.001 version increment
        const versionNumber = Math.floor(totalCommits / 10) * 0.001;
        const version = `v${versionNumber.toFixed(3)}`;

        return NextResponse.json({
            version,
            totalCommits,
            lastUpdated: new Date().toISOString()
        });
    } catch (error) {
        console.error("Error fetching version:", error);

        // Fallback version if API fails
        return NextResponse.json({
            version: "v0.015",
            totalCommits: 150,
            lastUpdated: new Date().toISOString(),
            error: "Using fallback version"
        });
    }
}; 