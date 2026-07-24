// لاحقًا سيتم استبداله بـ axios
export const getAboutNumbers = async () => {
  // Fallback مؤقت لحد ما يجهز الباك اند
  return {
    volunteers: 500,
    stats: [
      { number: 50, label: "Organizations" },
      { number: 1000, label: "Hours Contributed" },
    ]
  };
};
