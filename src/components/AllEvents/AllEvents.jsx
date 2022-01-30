import React, { useEffect, useState } from "react";
import Card from "../UI/Card/Card";
import "./AllEvents.scss";
import SearchPart from "../Landing/SearchPart/SearchPart";
import { useLocation } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";
import { convertData } from "../../utils/convertDate";
import Search from "../Landing/Search/Search";
import Loading from "../UI/Loading/Loading";

const AllEvents = () => {
  const [cardsArray, setCardsArr] = useState();
  const [eventsCopy, setEventsCopy] = useState();
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    axiosInstance
      .get("/api/events")
      .then((res) => {
        console.log("res :>> ", res);
        setCardsArr(res.data);
        setEventsCopy(res.data);
        setIsLoading(false);
      })
      .catch((err) => {
        console.log("err :>> ", err);
      });
  }, []);

  localStorage.setItem("search", search);

  const location = useLocation();

  const { filtered } =
    location.state && location.state.filtered ? location.state : {};
  const { notFound } =
    location.state && location.state.notFound ? location.state : {};
  const { searchValue } =
    location.state && location.state.searchValue ? location.state : {};

  if (isLoading) {
    return <Loading />;
  }
  return (
    <>
      <div className="main">
        {/* <SearchPart
          cname="searchPart"
          events={cardsArray}
          pathName={"/allEvents"}
        /> */}
        <Search events={cardsArray} setEventsCopy={setEventsCopy} />
        <div className="TitlePart">
          <p className="Title">
            All events{searchValue ? `: ${searchValue}` : ""}
          </p>
          <hr className="Line" />
        </div>
        <div className="CardsContainer">
          {cardsArray &&
            eventsCopy.map((event) => {
              return (
                <Card
                  key={event.eventId}
                  image={event.backgroundUrl}
                  name={event.title}
                  date={convertData(event.startTime)}
                  eventId={event.eventId}
                  isLiked={event.isLiked}
                />
              );
            })}
          {/* {!filtered
            ? cardsArray.map((card) => {
                return (
                  <Card
                    image={card.backgroundUrl}
                    name={card.title}
                    eventId={card.eventId}
                    isLiked={card.isLiked}
                    key={card.eventId}
                    date={convertData(card.startTime)}
                  />
                );
              })
            : filtered.map((event) => {
                return (
                  <Card
                    image={event.backgroundUrl}
                    name={event.title}
                    date={convertData(event.startTime)}
                    key={event.eventId}
                    isLiked={event.isLiked}
                    eventId={event.eventId}
                  />
                );
              })} */}
          {/* {filtered.length === 0 && <p>{notFound}</p>} */}

          {/* {isMatch ? (
            filteredSearch.map((event, index) => {
              return (
                <Card image={event.image} name={event.name} date={event.date} />
              );
            })
          ) : (
            <h3>Not found</h3>
          )} */}
        </div>
      </div>
    </>
  );
};

export default AllEvents;
