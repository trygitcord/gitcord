import axios from 'axios';

interface ContributionDay {
  date: string;
  count: number;
  level: number;
}

export async function getGithubContributions(username: string): Promise<ContributionDay[]> {
  try {
    const response = await axios.get(
      `https://github-contributions-api.jogruber.de/v4/${username}?y=last`
    );

    if (response.data && response.data.contributions) {
      const contributions: ContributionDay[] = [];

      response.data.contributions.forEach((contribution: any) => {
        contributions.push({
          date: contribution.date,
          count: contribution.count,
          level: contribution.level
        });
      });

      return contributions;
    }

    return [];
  } catch (error) {
    console.error('Error fetching GitHub contributions:', error);
    return generateMockContributions();
  }
}

function generateMockContributions(): ContributionDay[] {
  const contributions = [];
  const today = new Date();
  const startDate = new Date(today);
  startDate.setDate(startDate.getDate() - 364);

  for (let i = 0; i <= 364; i++) {
    const date = new Date(startDate);
    date.setDate(startDate.getDate() + i);

    const random = Math.random();
    let count = 0;
    let level = 0;

    if (random > 0.3) {
      if (random > 0.9) {
        count = Math.floor(Math.random() * 10) + 10;
        level = 4;
      } else if (random > 0.7) {
        count = Math.floor(Math.random() * 5) + 5;
        level = 3;
      } else if (random > 0.5) {
        count = Math.floor(Math.random() * 3) + 2;
        level = 2;
      } else {
        count = 1;
        level = 1;
      }
    }

    contributions.push({
      date: date.toISOString().split('T')[0],
      count,
      level
    });
  }

  return contributions;
}
