using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using System.Web.Http.Results;
using WebProject.Database;
using WebProject.Models;
using WebProject.Models.Request;
using WebProject.Models.Response;
using WebProject.Providers;

namespace WebProject.Controllers
{
    public class RideController : ApiController
    {
        [HttpPost]
        public IHttpActionResult Order([FromBody] OrderRideRequest request)
        {
            var session = SessionProvider.GetInstance().GetSession(request.Token);

            if(session == null)
            {
                return Json(new NoAccessResponse());
            }

            Auth auth = new Auth(Database.Database.GetInstance());

            session["user"] = auth.GetUserById(((User)session["user"]).Id); //update user from db

            if(! (session["user"] is Customer))
            {
                return Json(new NoAccessResponse());
            }

            OrderRideResponse response = new OrderRideResponse();

            Ride ride = new Ride();
            ride.Time = DateTimeOffset.UtcNow.ToUnixTimeSeconds();
            ride.Origin = request.Location;
            ride.VehicleType = null;

            if(request.VehicleType >= 0 && request.VehicleType <= (int) VehicleType.Van)
            {
                ride.VehicleType = (VehicleType) request.VehicleType;
            }
            ride.Customer = (Customer) session["user"];
            ride.Status = RideStatus.Created;

            Rides rides = new Rides(Database.Database.GetInstance());

            if(rides.AddRide(ride))
            {
                response.Code = 0;
            }
            else
            {
                response.Code = 2;
                response.Error = "Unknown error!";
            }

            return Json(response);
        }

        [HttpPost]
        public IHttpActionResult Create([FromBody] CreateRideRequest request)
        {
            var session = SessionProvider.GetInstance().GetSession(request.Token);

            if (session == null)
            {
                return Json(new NoAccessResponse());
            }

            Auth auth = new Auth(Database.Database.GetInstance());

            session["user"] = auth.GetUserById(((User)session["user"]).Id); //update user from db

            if (!(session["user"] is Dispatcher))
            {
                return Json(new NoAccessResponse());
            }

            CreateRideResponse response = new CreateRideResponse();

            Ride ride = new Ride();
            ride.Time = DateTimeOffset.UtcNow.ToUnixTimeSeconds();
            ride.Origin = request.Location;
            ride.VehicleType = null;

            if (request.VehicleType >= 0 && request.VehicleType <= (int)VehicleType.Van)
            {
                ride.VehicleType = (VehicleType)request.VehicleType;
            }
            ride.Driver = (Driver) auth.GetUserById(request.DriverId).GetFromRole();
            ride.Dispatcher = (Dispatcher) session["user"];
            ride.Status = RideStatus.Formed;

            Rides rides = new Rides(Database.Database.GetInstance());

            if(rides.GetFreeDrivers().Any(driver => ride.Driver.Id == driver.Id))
            {
                if (rides.AddRide(ride))
                {
                    response.Code = 0;
                }
                else
                {
                    response.Code = 2;
                    response.Error = "Unknown error!";
                }
            }
            else
            {
                response.Code = 3;
                response.Error = "Driver taken!";
            }

            return Json(response);
        }

        [HttpPost]
        public IHttpActionResult Edit([FromBody] EditRideRequest request)
        {
            var session = SessionProvider.GetInstance().GetSession(request.Token);

            if (session == null)
            {
                return Json(new NoAccessResponse());
            }

            Auth auth = new Auth(Database.Database.GetInstance());

            session["user"] = auth.GetUserById(((User)session["user"]).Id); //update user from db

            if (!(session["user"] is Customer))
            {
                return Json(new NoAccessResponse());
            }

            EditRideResponse response = new EditRideResponse();

            Rides rides = new Rides(Database.Database.GetInstance());

            Ride ride = rides.GetRideById(request.RideId);

            if (ride != null)
            {
                ride.Origin = request.Location;
                ride.VehicleType = null;

                if (ride.Customer == null || ((User)session["user"]).Id != ride.Customer.Id)
                {
                    return Json(new NoAccessResponse());
                }

                if (ride.Status != RideStatus.Created)
                {
                    response.Code = 4;
                    response.Error = "Ride not in 'Created' state!";
                    return Json(response);
                }

                if (request.VehicleType >= 0 && request.VehicleType <= (int)VehicleType.Van)
                {
                    ride.VehicleType = (VehicleType) request.VehicleType;
                }

                if (rides.UpdateRide(ride))
                {
                    response.Code = 0;
                }
                else
                {
                    response.Code = 2;
                    response.Error = "Unknown error!";
                }
            }
            else
            {
                response.Code = 3;
                response.Error = "Ride not found!";
            }

            return Json(response);
        }

        [HttpGet]
        public IHttpActionResult GetAll([FromUri] RideListRequest request)
        {
            var session = SessionProvider.GetInstance().GetSession(request.Token);

            if (session == null)
            {
                return Json(new NoAccessResponse());
            }

            Auth auth = new Auth(Database.Database.GetInstance());
            Rides rides = new Rides(Database.Database.GetInstance());
            session["user"] = auth.GetUserById(((User)session["user"]).Id); //update user from db

            RideListResponse response = new RideListResponse();
            response.Code = 0;

            if (session["user"] is Customer)
            {
                response.Rides = rides.GetRidesByCustomerId(((User)session["user"]).Id);
            }
            else if(session["user"] is Driver)
            {
                Driver driver = (Driver) session["user"];

                response.Rides = rides.GetRidesByDriverId(((User)session["user"]).Id);
                response.Extra = new List<Ride>();

                foreach(Ride ride in rides.GetFreeRides())
                {
                    if(ride.VehicleType == null || ride.VehicleType == driver.Vehicle.Type)
                    {
                        response.Extra.Add(ride);
                    }
                }
            }
            else if(session["user"] is Dispatcher)
            {
                response.Rides = rides.GetRidesByDispatcherId(((User)session["user"]).Id);
                response.Extra = rides.GetAllRides();
            }

            return Json(response);
        }

        [HttpPost]
        public IHttpActionResult Take([FromBody] TakeRideRequest request)
        {
            var session = SessionProvider.GetInstance().GetSession(request.Token);

            if (session == null)
            {
                return Json(new NoAccessResponse());
            }

            Auth auth = new Auth(Database.Database.GetInstance());
            Rides rides = new Rides(Database.Database.GetInstance());
            session["user"] = auth.GetUserById(((User)session["user"]).Id); //update user from db


            if (! (session["user"] is Driver))
            {
                return Json(new NoAccessResponse());
            }

            Response response = new Response();
            Ride ride = rides.GetRideById(request.RideId);

            if(ride != null)
            {
                if(ride.Status == RideStatus.Created)
                {
                    ride.Status = RideStatus.Accepted;
                    ride.Driver = (Driver) session["user"];

                    if(rides.UpdateRide(ride))
                    {
                        response.Code = 0;
                    }
                    else
                    {
                        response.Code = 2;
                        response.Error = "Unknown error!";
                    }
                }
                else
                {
                    response.Code = 3;
                    response.Error = "Invalid ride state!";
                }
            }
            else
            {
                response.Code = 4;
                response.Error = "Invalid ride!";
            }

            return Json(response);
        }

        [HttpPost]
        public IHttpActionResult Give([FromBody] GiveRideRequest request)
        {
            var session = SessionProvider.GetInstance().GetSession(request.Token);

            if (session == null)
            {
                return Json(new NoAccessResponse());
            }

            Auth auth = new Auth(Database.Database.GetInstance());
            Rides rides = new Rides(Database.Database.GetInstance());
            session["user"] = auth.GetUserById(((User)session["user"]).Id); //update user from db


            if (!(session["user"] is Dispatcher))
            {
                return Json(new NoAccessResponse());
            }

            Response response = new Response();
            Ride ride = rides.GetRideById(request.RideId);

            if (ride != null)
            {
                if (ride.Status == RideStatus.Created)
                {
                    ride.Status = RideStatus.Accepted;
                    ride.Driver = (Driver) auth.GetUserById(request.DriverId);
                    ride.Dispatcher = (Dispatcher)session["user"];

                    if (ride.Driver == null || rides.UpdateRide(ride))
                    {
                        response.Code = 0;
                    }
                    else
                    {
                        response.Code = 2;
                        response.Error = "Unknown error!";
                    }
                }
                else
                {
                    response.Code = 3;
                    response.Error = "Invalid ride state!";
                }
            }
            else
            {
                response.Code = 4;
                response.Error = "Invalid ride!";
            }

            return Json(response);
        }

        [HttpGet]
        public IHttpActionResult GetFreeDrivers([FromUri] GetFreeDriversRequest request)
        {
            var session = SessionProvider.GetInstance().GetSession(request.Token);

            if (session == null)
            {
                return Json(new NoAccessResponse());
            }

            if(((User) session["user"]).Role != Role.Dispatcher)
            {
                return Json(new NoAccessResponse());
            }

            Rides rides = new Rides(Database.Database.GetInstance());

            GetFreeDriversResponse response = new GetFreeDriversResponse();
            response.Drivers = rides.GetFreeDrivers();
            response.Code = 0;

            return Json(response);
        }

        [HttpGet]
        public IHttpActionResult Get([FromUri] GetRideRequest request)
        {
            var session = SessionProvider.GetInstance().GetSession(request.Token);

            if (session == null)
            {
                return Json(new NoAccessResponse());
            }

            Rides rides = new Rides(Database.Database.GetInstance());

            GetRideResponse response = new GetRideResponse();
            response.Ride = rides.GetRideById(request.RideId);
            response.Code = 0;

            if(response.Ride == null)
            {
                response.Code = 2;
                response.Error = "Ride not found!";
            }

            return Json(response);
        }

        [HttpPost]
        public IHttpActionResult Finish([FromBody] FinishRideRequest request)
        {
            var session = SessionProvider.GetInstance().GetSession(request.Token);

            if (session == null)
            {
                return Json(new NoAccessResponse());
            }

            Rides rides = new Rides(Database.Database.GetInstance());

            FinishRideResponse response = new FinishRideResponse();
            Ride ride = rides.GetRideById(request.RideId);

            if(ride != null)
            {
                if ((ride.Driver != null && ride.Driver.Id == ((User)session["user"]).Id && (ride.Status == RideStatus.Formed || ride.Status == RideStatus.Accepted || ride.Status == RideStatus.Processed)) || (ride.Customer != null && ride.Customer.Id == ((User)session["user"]).Id && (ride.Status == RideStatus.Created || ride.Status == RideStatus.Successful)))
                {
                    ride.Comment = request.Comment;

                    if (ride.Comment != null)
                    {
                        ride.Comment.Time = DateTimeOffset.UtcNow.ToUnixTimeSeconds();
                        ride.Comment.RideId = ride.Id;
                        ride.Comment.UserId = ((User)session["user"]).Id;
                        ride.Comment.Username = ((User)session["user"]).Username;
                    }

                    if (request.Success)
                    {
                        if (ride.Status != RideStatus.Successful)
                        {
                            ride.Status = RideStatus.Successful;
                            ride.Destination = request.Destination;
                            ride.Price = request.Price;
                        }
                    }
                    else
                    {
                        if ((ride.Customer != null && ride.Customer.Id == ((User)session["user"]).Id))
                        {
                            ride.Status = RideStatus.Cancelled;
                        }
                        else
                        {
                            ride.Status = RideStatus.Failed;
                        }

                    }

                    if (rides.UpdateRide(ride))
                    {
                        response.Code = 0;
                    }
                    else
                    {
                        response.Code = 2;
                        response.Error = "Unknown error!";
                    }
                }
                else
                {
                    return Json(new NoAccessResponse());
                }
            }
            else
            {
                response.Code = 3;
                response.Error = "Ride not found!";
            }

            return Json(response);
        }
    }
}
