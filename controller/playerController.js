const slugify = require("slugify");
const Nations = require("../model/nation");
const Players = require("../model/player");

let positionData = [
  { id: "1", name: "GK" },
  { id: "2", name: "CB" },
  { id: "3", name: "RB" },
  { id: "4", name: "LB" },
  { id: "5", name: "CM" },
  { id: "6", name: "CDM" },
  { id: "7", name: "CAM" },
  { id: "8", name: "RW" },
  { id: "9", name: "LW" },
  { id: "10", name: "CF" },
  { id: "10", name: "RF" },
  { id: "11", name: "LF" },
];

let captainData = [
  { id: "1", name: "Yes", value: true },
  { id: "2", name: "No", value: false },
];

class playerController {
  players(req, res, next) {
    Promise.all([Nations.find({}), Players.find({}).populate("nation")])
      .then(([nations, players]) => {
        players.forEach((player) => {
          player.isAdmin = req.isAuthenticated() && req.user.isAdmin;
        });
        res.locals.isAuthenticated = req.isAuthenticated();
        res.locals.user = req.user;
        res.render("players", {
          title: "Player page - World Cup 2022",
          players: players,
          nations: nations,
          positionList: positionData,
          isCaptain: captainData,
        });
      })
      .catch(next);
  }

  playerDetail(req, res, next) {
    const slug = req.params.slug;
    if (!slug) {
      return next(new Error("Player not found"));
    }
    Players.findOne({ slug })
      .populate("nation")
      .then((player) => {
        res.locals.isAuthenticated = req.isAuthenticated();
        res.locals.user = req.user;
        res.status(200).render("playerDetail", {
          title: `${player.name} - WC 2022`,
          playerDeatail: player,
        });
      })
      .catch(next);
  }

  // create(req, res, next) {
  //   const newPlayer = new Players(req.body);
  //   console.log(req.body);
  //   newPlayer
  //     .save()
  //     .then(() => res.status(201).redirect("/players"))
  //     .catch((err) => {});
  // }

  async create(req, res, next) {
    const {
      name,
      image,
      club,
      description,
      position,
      goals,
      isCaptain,
      nation,
    } = req.body;

    try {
      const player = await Players.create({
        name,
        image,
        club,
        description,
        position,
        goals,
        isCaptain,
        nation,
        slug: slugify(name, { lower: true }),
      });
      // populate the 'nations' field with the corresponding nation document
      await player.populate("nation");
      await player.save();
      res.redirect("/players");
    } catch (error) {
      console.error(error);
      res.render("faildCreate");
    }
  }

  // async create(req, res, next) {
  //   try {
  //     const {
  //       name,
  //       image,
  //       club,
  //       description,
  //       position,
  //       goals,
  //       isCaptain,
  //       nation,
  //     } = req.body;
  //     let errors = [];

  //     if (errors.length > 0) {
  //       Promise.all([Nations.find({}), Players.find({}).populate("nation")])
  //         .then(([nations, players]) => {
  //           players.forEach((player) => {
  //             player.isAdmin = req.isAuthenticated() && req.user.isAdmin;
  //           });
  //           res.locals.isAuthenticated = req.isAuthenticated();
  //           res.locals.user = req.user;
  //           res.render("players", {
  //             title: "Player page - World Cup 2022",
  //             players: players,
  //             nations: nations,
  //             positionList: positionData,
  //             isCaptain: captainData,
  //             errors,
  //           });
  //         })
  //         .catch(next);
  //     } else {
  //       await Players.findOne({ name: name }).then((player) => {
  //         if (player) {
  //           errors.push({ msg: "Username already exists" });
  //           res.render("players", {
  //             errors,
  //           });
  //         } else {
  //           const player = Players.create({
  //             name,
  //             image,
  //             club,
  //             description,
  //             position,
  //             goals,
  //             isCaptain,
  //             nation,
  //             slug: slugify(name, { lower: true }),
  //           });
  //           // populate the 'nations' field with the corresponding nation document
  //           player.populate("nation").save();
  //           res.redirect("/players");
  //         }
  //       });
  //     }
  //   } catch (error) {
  //     console.error(error);
  //     res.render("error");
  //   }
  // }

  getForFormEdit(req, res, next) {
    const playerId = req.params.playerId;
    Players.findById(playerId).then((player) => {
      res.json({
        player: {
          id: player._id,
          name: player.name,
          image: player.image,
          club: player.club,
          goals: player.goals,
          description: player.description,
          position: player.position,
          isCaptain: player.isCaptain,
          nation: player.nation,
        },
      });
    });
  }

  update(req, res, next) {
    const playerId = req.params.playerId;
    if (!playerId) {
      return next(new ErrorHandler("Not found player!", 404));
    }
    Players.findByIdAndUpdate(playerId, req.body, { new: true })
      .then((player) => {
        res.redirect("/players");
      })
      .catch((next) => res.render("faildUpdate"));
  }

  delete(req, res, next) {
    const player = Players.findById(req.params.playerId);
    console.log(player);
    if (!player) {
      return next(new ErrorHandler("Not found player", 404));
    }
    player.remove().then(() => res.redirect("/players"));
  }
}

module.exports = new playerController();
