export default getData => async ctx => {
  const { req, res } = ctx;

  // check auth here
  const viewer = {};
  ctx.viewer = viewer;

  if (ctx.viewer) {
    return Object.assign(await getData(ctx), { viewer });
  }

  if (res) return res.redirect("/login");
  if (window) window.location.href = "/login";
};
