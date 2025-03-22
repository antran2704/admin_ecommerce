const StatisticItemLoading = () => {
  return (
    <div
      className={"flex flex-col py-5 px-8 bg-white rounded-2xl shadow-lg gap-2"}
    >
      <div className="animate-pulse bg-slate-300 h-6 w-1/4 rounded-md"></div>
      <p className="animate-pulse bg-slate-300 h-6 w-2/4 rounded-md"></p>
      <p className="animate-pulse bg-slate-300 h-6 w-3/4 rounded-md"></p>
    </div>
  );
};

export default StatisticItemLoading;
