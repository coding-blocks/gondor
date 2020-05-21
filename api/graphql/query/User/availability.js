const availability = async (parent, { dateTimeRange }, ctx) => {
  const key = {
    user_id: parent.id,
    dateTimeRange,
    exculdeEvents: [],
  };
  const isAvailable = await ctx.loaders.userAvailabilityLoader.load(key);
  delete ctx.loaders.userAvailabilityLoader;
  return isAvailable;
};

export default availability;
