const db = require("../../Utils/db_connection");
const { queryAsync, queryAsyncWithoutValue } = require("../../Utils/helper");
require("dotenv").config();
const baseUrl = process.env.baseUrl;

exports.addCourseCategory = async (req, res, next) => {
  try {
    const { name } = req.body;
    const image = req.files["image"];

    let imageUrl = null;
    if (image) {
      imageUrl = `${baseUrl}/uploads/${image[0].filename}`;
    }

    const addQuery = `
      INSERT INTO course_cat (name, image) VALUES (?, ?)
    `;
    await queryAsync(addQuery, [name, imageUrl]);

    return res.status(200).json({
      status: true,
      message: "Course category added successfully",
      category: {
        name,
        image: imageUrl,
      },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      status: false,
      message: "Internal Server Error",
    });
  }
};

exports.addCourseDetails = async (req, res, next) => {
  try {
    const { course_id, title, description } = req.body;

    const addQuery = `
      INSERT INTO course_details (course_id, title, description) VALUES (?, ?, ?)
    `;
    await queryAsync(addQuery, [course_id, title, description]);

    return res.status(200).json({
      status: true,
      message: "Course details added successfully",
      details: {
        course_id,
        title,
        description,
      },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      status: false,
      message: "Internal Server Error",
    });
  }
};

exports.getAllCourseCategories = async (req, res, next) => {
  try {
    const getQuery = `
      SELECT * FROM course_cat ORDER BY id ASC
    `;

    const categories = await queryAsync(getQuery);

    return res.status(200).json({
      status: true,
      message: "",
      categories: categories,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      status: false,
      message: "Internal Server Error",
      categories: [],
    });
  }
};

exports.addCourse = async (req, res, next) => {
  try {
    const {
      title,
      instructor,
      price,
      discounted_price,
      cat_id,
      description,
      total_enrolled,
      duration,
      time,
      total_video_lecture,
      total_pdf,

      learning_outcome,
      course_details,
    } = req.body;

    const image = req.files["image"];
    const video = req.files["video"];

    let imageUrl = null;
    if (image) {
      imageUrl = `${baseUrl}/uploads/${image[0].filename}`;
    }

    let videoUrl = null;
    if (video) {
      videoUrl = `${baseUrl}/uploads/${video[0].filename}`;
    }

    const addCourseQuery = `
      INSERT INTO course_list (image, title, instructor, price, discounted_price, cat_id, description, total_enrolled, duration, time, total_video_lecture, total_pdf, video, learning_outcome, course_details)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    await queryAsync(addCourseQuery, [
      imageUrl,
      title,
      instructor,
      price,
      discounted_price,
      cat_id,
      description,
      total_enrolled,
      duration,
      time,
      total_video_lecture,
      total_pdf,
      videoUrl,
      learning_outcome,
      course_details,
    ]);

    return res.status(200).json({
      status: true,
      message: "Course added successfully",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      status: false,
      message: "Internal Server Error",
    });
  }
};

exports.getAllCourses = async (req, res, next) => {
  try {
    const getCoursesQuery = `
      SELECT * FROM course_list ORDER BY id ASC
    `;

    const courses = await queryAsync(getCoursesQuery);

    return res.status(200).json({
      status: true,
      message: "",
      courses: courses,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      status: false,
      message: "Internal Server Error",
      courses: [],
    });
  }
};

exports.getCoursesByCatId = async (req, res, next) => {
  try {
    const { cat_id } = req.query;

    const getCoursesByCatIdQuery = `
      SELECT 
        course_list.*,
        course_cat.name AS cat_name 
      FROM 
        course_list 
      JOIN 
        course_cat 
      ON 
        course_list.cat_id = course_cat.id 
      WHERE 
        course_list.cat_id = ? 
      ORDER BY 
        course_list.id ASC
    `;

    const courses = await queryAsync(getCoursesByCatIdQuery, [cat_id]);

    return res.status(200).json({
      status: true,
      message: "",
      courses: courses,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      status: false,
      message: "Internal Server Error",
      courses: [],
    });
  }
};

exports.getCourseDetailsById = async (req, res, next) => {
  try {
    const { course_id } = req.query;

    // Fetch course data
    const getCourseByIdQuery = "SELECT * FROM course_list WHERE id = ?";
    const course = await queryAsync(getCourseByIdQuery, [course_id]);

    // Parse the learning_outcome as a list if it exists and is not null
    if (course.length > 0 && course[0].learning_outcome) {
      course[0].learning_outcome = JSON.parse(
        course[0].learning_outcome.replace(/'/g, '"')
      );
    }

    // Fetch related data
    const instructorQuery =
      "SELECT * FROM course_instructor WHERE course_id = ?";
    const instructor = await queryAsync(instructorQuery, [course_id]);

    const courseContainerQuery =
      "SELECT * FROM course_container WHERE course_id = ?";
    const courseContainer = await queryAsync(courseContainerQuery, [course_id]);

    const courseVideoQuery = "SELECT * FROM course_video WHERE course_id = ?";
    const courseVideo = await queryAsync(courseVideoQuery, [course_id]);

    const courseDetailsQuery =
      "SELECT * FROM course_details WHERE course_id = ?";
    const courseDetails = await queryAsync(courseDetailsQuery, [course_id]);

    // Parse the description as a list if it exists and is not null
    if (courseDetails.length > 0 && courseDetails[0].description) {
      courseDetails[0].description = JSON.parse(
        courseDetails[0].description.replace(/'/g, '"')
      );
    }

    return res.status(200).json({
      status: true,
      message: "",
      course: course[0],
      instructor,
      courseContainer,
      courseVideo,
      courseDetails,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      status: false,
      message: "Internal Server Error",
    });
  }
};

exports.addInstructor = async (req, res, next) => {
  try {
    const { name, designation, course_id } = req.body;
    const image = req.files["image"];

    let imageUrl = null;
    if (image) {
      imageUrl = `${baseUrl}/uploads/${image[0].filename}`;
    }

    const addInstructorQuery = `
      INSERT INTO course_instructor (name, designation, course_id, image) 
      VALUES (?, ?, ?, ?)
    `;

    await queryAsync(addInstructorQuery, [
      name,
      designation,
      course_id,
      imageUrl,
    ]);

    return res.status(200).json({
      status: true,
      message: "Instructor added successfully",
      instructor: {
        name,
        designation,
        image: imageUrl,
        course_id,
      },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      status: false,
      message: "Internal Server Error",
    });
  }
};
exports.getInstructors = async (req, res, next) => {
  try {
    const getInstructorsQuery = `
      SELECT * FROM course_instructor ORDER BY id ASC
    `;

    const instructors = await queryAsync(getInstructorsQuery);

    return res.status(200).json({
      status: true,
      message: "",
      instructors: instructors,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      status: false,
      message: "Internal Server Error",
      instructors: [],
    });
  }
};

exports.addCourseContainer = async (req, res, next) => {
  try {
    const { title, description, course_id } = req.body;
    const image = req.files["image"];

    let imageUrl = null;
    if (image) {
      imageUrl = `${baseUrl}/uploads/${image[0].filename}`;
    }

    const addCourseContainerQuery = `
      INSERT INTO course_container (title, description, course_id, image) 
      VALUES (?, ?, ?, ?)
    `;

    await queryAsync(addCourseContainerQuery, [
      title,
      description,
      course_id,
      imageUrl,
    ]);

    return res.status(200).json({
      status: true,
      message: "Course Container added successfully",
      courseContainer: {
        title,
        description,
        image: imageUrl,
        course_id,
      },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      status: false,
      message: "Internal Server Error",
    });
  }
};

exports.getCourseContainers = async (req, res, next) => {
  try {
    const getCourseContainersQuery = `
      SELECT * FROM course_container ORDER BY id ASC
    `;

    const courseContainers = await queryAsync(getCourseContainersQuery);

    return res.status(200).json({
      status: true,
      message: "",
      courseContainers: courseContainers,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      status: false,
      message: "Internal Server Error",
      courseContainers: [],
    });
  }
};

exports.addCourseVideo = async (req, res, next) => {
  try {
    const { title, is_paid, course_id } = req.body;
    const video = req.files["video"];

    let videoUrl = null;
    if (video) {
      videoUrl = `${baseUrl}/uploads/${video[0].filename}`;
    }

    const addQuery = `
      INSERT INTO course_video (title, video, is_paid) VALUES (?, ?, ?, ?)
    `;
    await queryAsync(addQuery, [title, videoUrl, course_id, is_paid]);

    return res.status(200).json({
      status: true,
      message: "Course category added successfully",
      course_video: {
        title,
        video: videoUrl,
        is_paid,
        course_id,
      },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      status: false,
      message: "Internal Server Error",
    });
  }
};

exports.getAllCourseVideo = async (req, res, next) => {
  try {
    const getQuery = `
      SELECT * FROM course_video ORDER BY id ASC
    `;

    const videos = await queryAsync(getQuery);

    return res.status(200).json({
      status: true,
      message: "",
      videos: videos,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      status: false,
      message: "Internal Server Error",
      videos: [],
    });
  }
};

exports.add_order = async (req, res, next) => {
  try {
    const { user_id, course_id } = req.body;
    const status = "pending";

    const addOrderQuery =
      "INSERT INTO buy_course (user_id, course_id, status) VALUES (?, ?, ?)";
    await queryAsync(addOrderQuery, [user_id, course_id, status]);

    return res.status(200).json({
      status: true,
      msg: "Order placed successfully",
      order: {
        user_id,
        course_id,
        status,
      },
    });
  } catch (e) {
    console.error(e);
    return res.status(500).json({
      status: false,
      msg: "Internal Server Error",
    });
  }
};

exports.getCourseOrdersByUserId = async (req, res, next) => {
  try {
    const { user_id } = req.query;

    const getCourseOrdersByUserIdQuery = `
      SELECT o.*, 
             c.title AS course_title, c.instructor, c.price, c.discounted_price, c.image, 
             cat.name AS cat_name
      FROM buy_course o
      INNER JOIN course_list c ON o.course_id = c.id
      INNER JOIN course_cat cat ON c.cat_id = cat.id
      WHERE o.user_id = ?
    `;

    const courseOrders = await queryAsync(getCourseOrdersByUserIdQuery, [
      user_id,
    ]);

    return res.status(200).json({ status: true, courseOrders });
  } catch (e) {
    console.error(e);
    return res.status(500).json({
      status: false,
      msg: "Internal Server Error",
    });
  }
};
