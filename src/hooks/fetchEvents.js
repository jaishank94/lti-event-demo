import React, { useState, useEffect, useRef } from "react";
import { collection, doc, getDoc, onSnapshot, query } from "firebase/firestore";
import { useAuth } from "../context/AuthContext";
import { db } from "../firebase";

export default function useFetchEvents() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [events, setEvents] = useState(null);
  const [basePrice, setBasePrice] = useState(0);

  const { currentUser } = useAuth();

  useEffect(() => {
    async function fetchData() {
      try {
        const docRef = query(collection(db, "events"));
        const docSnap = onSnapshot(docRef, (qSnap) => {
          let eventArry = [];
          let newCount = 0;
          qSnap.forEach((doc) => {
            eventArry.push({ ...doc.data(), id: doc.id });
            newCount += parseInt(doc.data().price);
          });

          setEvents(eventArry);
          setBasePrice(newCount);
          setLoading(false);
        });
      } catch (err) {
        setError("Failed to load events");
        setLoading(false);

        console.log(err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  return { loading, error, events, basePrice, setEvents };
}
