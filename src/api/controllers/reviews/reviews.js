import Reviews from '../../models/reviews.js'
import { RESPONSE_ERRORS } from '../../../shared/errors.js'

//+ Эндпоинт для получения отзывов:
export const getAllReviews = async (req, res) => {
  try {
    const reviews = await Reviews.findAll();

    if (reviews.length === 0) {
      return res.status(404).json({ message: "Отзывы не найдены" });
    }

    return res.json(reviews);
  } catch (error) {
    console.error("Error fetching reviews:", error);
    return res.status(500).json(RESPONSE_ERRORS.EXTERNAL_SERVER_ERROR);
  }
};