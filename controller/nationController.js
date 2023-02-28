const Nations = require("../model/nation");

class nationController {
  nations(req, res, next) {
    Nations.find({})
      .then((nations) => {
        res.render("nations", {
          title: "Nation page - World Cup 2022",
          nations: nations,
        });
      })
      .catch(next);
  }

  nationDetail(req, res, next) {
    const nationId = req.params.nationId;
    if (!nationId) {
      return next(new Error("Nation not found"));
    }
    Nations.findById(nationId)
      .then((nation) => {
        res.status(200).json({
          nation: nation,
        });
      })
      .catch(next);
  }

  create(req, res, next) {
    const nation = new Nations(req.body);
    console.log(req.body);
    nation
      .save()
      .then(() => res.redirect("/nations"))
      .catch((err) => {});
  }

  getForFormEdit(req, res, next) {
    const nationId = req.params.nationId;
    Nations.findById(nationId).then((nation) => {
      res.json({
        nation: {
          id: nation._id,
          name: nation.name,
          description: nation.description,
          image: nation.image,
        },
      });
    });
  }

  update(req, res, next) {
    const nationId = req.params.nationId;
    if (!nationId) {
      return next(new ErrorHandler("Not found nation", 404));
    }
    Nations.findByIdAndUpdate(nationId, req.body, { new: true })
      .then((nation) => {
        res.redirect("/nations");
      })
      .catch(next);
  }

  delete(req, res, next) {
    const nation = Nations.findById(req.params.nationId);
    if (!nation) {
      return next(new ErrorHandler("Not found nation", 404));
    }
    nation.remove().then(() => res.redirect("/nations"));
  }
}

module.exports = new nationController();
