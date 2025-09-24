const express = require("express");

const events = require("./mocks/eventos.json");
const categories = require("./mocks/categorias.json");

const { paginateData, calculateEventDistances, sendError } = require("./utils");

const app = express();
const port = 3000;

app.get("/", (req, res) => {
  res.send("Node Server");
});

app.get("/categories", (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;

  const paginatedResult = paginateData(categories, page, limit);

  res.send({
    success: true,
    ...paginatedResult,
  });
});

app.get("/events", (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const latitude = parseFloat(req.query.latitude);
  const longitude = parseFloat(req.query.longitude);

  if (!latitude || !longitude) {
    sendError(res, "Latitude and longitude query parameters are required.");
  }

  const eventList = calculateEventDistances(events, latitude, longitude);
  const paginatedResult = paginateData(eventList, page, limit);

  res.send({
    success: true,
    ...paginatedResult,
  });
});

app.get("/events/category/:id", (req, res) => {
  const categoryId = parseInt(req.params.id);
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const latitude = parseFloat(req.query.latitude);
  const longitude = parseFloat(req.query.longitude);

  if (!latitude || !longitude) {
    sendError(res, "Latitude and longitude query parameters are required.");
  }

  const filteredEvents = events.filter(
    (event) => event.categoryId === categoryId
  );

  const eventList = calculateEventDistances(
    filteredEvents,
    latitude,
    longitude
  );

  const paginatedResult = paginateData(eventList, page, limit);

  res.send({
    success: true,
    ...paginatedResult,
  });
});

app.get("/event/:id", (req, res) => {
  const eventId = parseInt(req.params.id);
  const latitude = parseFloat(req.query.latitude);
  const longitude = parseFloat(req.query.longitude);

  if (!latitude || !longitude) {
    sendError(res, "Latitude and longitude query parameters are required.");
  }

  const filteredEvent = events.find((event) => event.id === eventId);

  if (!filteredEvent) {
    sendError(res, "Event not found");
  }

  const event = calculateEventDistances([filteredEvent], latitude, longitude);

  res.send({
    success: true,
    data: event,
  });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
