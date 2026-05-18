export interface YearStats {
  totalActivities: number;
  monthlyActivities: number;
  participants: number;
  evidence: number;
  pending: number;
  monthlyChange: string;
}

export const getStatsForYear = (year: number): YearStats => {
  // Giả lập dữ liệu khác nhau cho mỗi năm
  const yearIndex = 2026 - year;

  const stats: { [key: number]: YearStats } = {
    2026: {
      totalActivities: 410,
      monthlyActivities: 73,
      participants: 8450,
      evidence: 2340,
      pending: 28,
      monthlyChange: '+12%'
    },
    2025: {
      totalActivities: 385,
      monthlyActivities: 68,
      participants: 7920,
      evidence: 2180,
      pending: 15,
      monthlyChange: '+8%'
    },
    2024: {
      totalActivities: 358,
      monthlyActivities: 62,
      participants: 7340,
      evidence: 1950,
      pending: 12,
      monthlyChange: '+15%'
    },
    2023: {
      totalActivities: 325,
      monthlyActivities: 58,
      participants: 6850,
      evidence: 1720,
      pending: 10,
      monthlyChange: '+10%'
    },
    2022: {
      totalActivities: 298,
      monthlyActivities: 52,
      participants: 6200,
      evidence: 1580,
      pending: 8,
      monthlyChange: '+5%'
    },
  };

  return stats[year] || stats[2026];
};
