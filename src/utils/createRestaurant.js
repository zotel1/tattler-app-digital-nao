import { generateObjectId } from './objectIdGenerator.js';
import { convertToISODate } from './convertDate.js';

export function createRestaurant({ name, borough, cuisine, address, grades, comments }) {
    return {
        _id: generateObjectId(),
        name,
        borough,
        cuisine,
        address,
        grades: grades.map((grade) => ({ ...grade, date: convertToISODate(grade.date) })),
        comments: comments.map((comment) => ({
            ...comment,
            date: convertToISODate(comment.date),
            _id: generateObjectId()
        })),
        restaurant_id: generateObjectId().toString() // Convertimos a string para facilitar su uso como ID
    };
}