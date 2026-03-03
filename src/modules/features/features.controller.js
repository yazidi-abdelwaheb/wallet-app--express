import { errorCatch } from "../../shared/index.js";
import Features from "./schemas/features.schema.js";

const model = Features;

export default class FeatureController {
  static async list(req, res) {
    try {
      let {page , limit , search} = req.query;

      page = parseInt(page) ?? 1
      limit = parseInt(limit) ?? 5

      let filter = {}
      if(search & search.trim()){
        filter.$or = [
          { title: { $regex: search.trim(), $options: "i" } },
          { subtitle: { $regex: search.trim(), $options: "i" } },
        ];
      }
      const features = await model.find(filter).skip(page).limit(limit)
      const totalDocs = await model.countDocuments(filter)

      return res.status(200).json({
        page,
        limit,
        totalDocs,
        data : features
      })

    } catch (error) {
      errorCatch(error, req, res);
    }
  }

  static async readOne(req, res) {
    try {
      const { id } = req.params;

      const feature = await model.findById(id);

      return res.status(200).json(feature);
    } catch (error) {
      errorCatch(error, req, res);
    }
  }

  static async updateOne(req, res) {
    try {
      const { id } = req.params;
      const { feature } = req.body;

      await model.updateOne(
        { _id: id },
        {
          title: feature.title,
          subtitle: feature.subtitle,
          icon: feature.icon,
          link: feature.link,
          order: feature.order,
        },
      );

      return res.status(200).json({ message: "feature updated successfully!" });
    } catch (error) {
      errorCatch(error, req, res);
    }
  }

  static async deleteOne(req, res) {
    try {
      const { id } = req.params;
      await model.deleteOne({ _id: id });
      return res.status(200).json({ message: "feature deleted successfully!" });
    } catch (error) {
      errorCatch(error, req, res);
    }
  }

  static async toggleActive(req, res) {
    try {
      const { id } = req.params;

      const features = await model.findById(id);

      features.isActive = !features.isActive;

      const status = features.isActive === true ? "activated" : "deactivated";

      features.save();

      return res
        .status(200)
        .json({ message: `feature ${status} successfully!` });
    } catch (error) {
      errorCatch(error, req, res);
    }
  }
}
