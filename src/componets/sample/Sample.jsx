import React, { useState } from "react";
import styles from "./sample.module.css";
import { FaHeart } from "react-icons/fa";

const Sample = () => {
  const [favorites, setFavorites] = useState({});

  const toggleFavorite = (index) => {
    setFavorites((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  const courses = [
    {
      label: "Label 1",
      title: "Ultimate UX design course",
      description: "Become a UX Design Teacher & Teach UX Design Online",
      instructor: "Anastasia",
      price: "$199",
      originalPrice: "$299",
      specialOffer: true,
      image: "https://via.placeholder.com/300x200",
    },
    {
      label: "Label 2",
      title: "How to do better at public speaking",
      description: "The perfect guide on how to improve your public speaking skills.",
      instructor: "Anna",
      price: "$99",
      originalPrice: null,
      specialOffer: false,
      image: "https://via.placeholder.com/300x200",
    },
    {
      label: "Label 3",
      title: "How to improve your business English",
      description: "Step by step guide to improve your business English in 30 days",
      instructor: "Ryan",
      price: "$100",
      originalPrice: "$199",
      specialOffer: true,
      image: "https://s3.amazonaws.com/cdn.freshdesk.com/data/helpdesk/attachments/production/12105160319/original/YoNyFjSLPxY0nnSGctwXYe2O0qNPuTnvjA.png?1645054923",
    },
  ];

  return (
    <div className={styles.cardContainer}>
      {courses.map((course, index) => (
        <div key={index} className={styles.card}>
          <button
            className={`${styles.favoriteButton} ${
              favorites[index] ? styles.favoriteActive : ""
            }`}
            onClick={() => toggleFavorite(index)}
          >
            <FaHeart />
          </button>
          <img src={course.image} alt={course.title} className={styles.image} />
          {course.specialOffer && <div className={styles.specialOffer}>special offer</div>}
          <div className={styles.label}>{course.label}</div>
          <h2 className={styles.courseTitle}>{course.title}</h2>
          <p className={styles.description}>{course.description}</p>
          <div className={styles.instructor}>{course.instructor}</div>
          <div className={styles.priceSection}>
            {course.originalPrice && (
              <span className={styles.originalPrice}>{course.originalPrice}</span>
            )}
            <span className={styles.price}>{course.price}</span>
          </div>
          <button className={styles.enrollButton}>Enroll</button>
        </div>
      ))}
    </div>
  );
};

export default Sample;
