const hostURL = "http://localhost:8000/v1";

async function httpGetPlanets() {
  // TODO: Once API is ready.
  const response = await fetch(`${hostURL}/planets`);
  return await response.json();
}

async function httpGetLaunches() {
  // TODO: Once API is ready.
  const response = await fetch(`${hostURL}/launches`);
  const fetchResponse = await response.json();
  return fetchResponse.sort((a, b) => {
    return a.flightNumber - b.flightNumber;
  });
}

async function httpSubmitLaunch(launch) {
  // TODO: Once API is ready.
  try {
    return await fetch(`${hostURL}/launches`, {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(launch),
    });
  } catch (err) {
    return {
      ok: false,
    }
  }
}

async function httpAbortLaunch(id) {
  // TODO: Once API is ready.
  try {
    return await fetch(`${hostURL}/launches/${id}`, {
      method: "delete",
    });
  } catch (err) {
    return {
      ok: false,
    }
  }
}

export {
  httpGetPlanets,
  httpGetLaunches,
  httpSubmitLaunch,
  httpAbortLaunch,
};