type IssuesAndWarnings = {
  issues: {
    alerts: number | null;
    nodes: number | null;
    operators: number | null;
    resourceUsage: number | null;
    totalCount: number | null;
  };
  warnings: {
    alerts: number | null;
    operators: number | null;
    resourceUsage: number | null;
  };
};

export { IssuesAndWarnings };
