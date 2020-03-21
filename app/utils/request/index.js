import axios from "axios";
import camelcase from "camelcase-keys";
import snakecase from "snakecase-keys";

const serialize = (body = {}, headers) => (headers["Content-Type"] === "application/json" ? snakecase(body) : body);

const deserialize = (res, { Accept }) => {
  if (Accept === "application/json") return camelcase(res?.data || {}, { deep: true });
  if (Accept === "text/html") return res?.data || "";
  return res;
};

const request = async (url, payload) => {
  const headers = Object.assign(
    {
      Accept: "application/json",
      ["Content-Type"]: "application/json"
    },
    payload?.headers
  );

  try {
    const response = await axios({
      url: "/api" + url,
      data: serialize(payload?.body, headers),
      method: payload?.method,
      config: { headers },
      headers,
      withCredentials: true
    });

    return deserialize(response, headers);
  } catch (err) {
    const data = err.response?.data || { error: { message: "Oh Snap! There was some error." } };

    if (data.error) throw { _default: data.error };
    if (data.errors)
      throw data.errors.reduce(
        (e, { key, message }) =>
          (e[
            String(key)
              .split(".")
              .map(p => camelcase(p))
              .join(".")
          ] = { message }) && e,
        {}
      );
    throw data;
  }
};

export default request;
