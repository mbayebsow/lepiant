export const articleExtract = async (url) => {
  const options = { method: "GET" };

  try {
    const data = await fetch(`https://extractor-lepiant.deno.dev?url=${url}`, options).then(
      (response) => response.json()
    );
    return data;
  } catch (error) {
    return null;
  }
};
