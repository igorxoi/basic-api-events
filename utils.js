const paginateData = (data, page = 1, limit = 10) => {
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  const totalItems = data.length;

  const paginatedData = data.slice(startIndex, endIndex);

  return {
    data: paginatedData,
    pagination: {
      totalItems,
      currentPage: parseInt(page),
      totalPages: Math.ceil(totalItems / limit),
      limit: parseInt(limit),
      hasNextPage: endIndex < totalItems,
      hasPreviousPage: page > 1,
    },
  };
};

function degreesToRadians(degrees) {
  return degrees * (Math.PI / 180);
}

const calculateDistanceBetweenCoordinates = (
  originLat,
  originLon,
  destinationLat,
  destinationLon
) => {
  const earthRadius = 6371e3;
  const originLatRad = degreesToRadians(originLat);
  const destinationLatRad = degreesToRadians(destinationLat);
  const deltaLat = degreesToRadians(destinationLat - originLat);
  const deltaLon = degreesToRadians(destinationLon - originLon);

  const a =
    Math.sin(deltaLat / 2) * Math.sin(deltaLat / 2) +
    Math.cos(originLatRad) *
      Math.cos(destinationLatRad) *
      Math.sin(deltaLon / 2) *
      Math.sin(deltaLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  const distance = earthRadius * c;
  return distance;
};

const formatDistance = (distance) => {
  if (distance >= 1000) {
    return `${(distance / 1000).toFixed(2)} km`;
  }
  return `${Math.round(distance)} m`;
};

const calculateEventDistances = (events, latitude, longitude) => {
  const eventList = events.map((event) => {
    const distanceInMeters = calculateDistanceBetweenCoordinates(
      latitude,
      longitude,
      event.address.latitude,
      event.address.longitude
    );

    return {
      ...event,
      distance: formatDistance(distanceInMeters),
      distanceInMeters,
    };
  });

  return eventList.sort((a, b) => a.distanceInMeters - b.distanceInMeters);
};

const sendError = (res, message) => {
  res.status(400).send({
    error: {
      message: message,
    },
  });
};

module.exports = {
  paginateData,
  calculateEventDistances,
  calculateEventDistances,
  sendError,
};
