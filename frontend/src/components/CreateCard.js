import React from "react";
import { useState, useEffect } from "react";
import { uid } from "uid";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";
import Iframe from "react-iframe";
import { groupBy } from "core-js/actual/array/group-by";
import "./CreateCard.css";

function CreateCard() {
  const [createCard, setCreateCard] = useState(false);
  const [modalClicked, setModalClicked] = useState(false);
  const [cardName, setCardName] = useState("");
  const [videoLink, setVideoLink] = useState("");
  const [category, setCategory] = useState("");
  const [allCards, setAllCards] = useState({});
  const [viewVideo, setViewVideo] = useState(false);
  const [videoUrl, setVideoUrl] = useState("");
  const [videoModal, setVideoModal] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [viewHistory, setViewHistory] = useState(false);
  const [historyModal, setHistoryModal] = useState(false);
  const [defaultCard, setDefaultCard] = useState({});
  const [defaultName, setDefaultName] = useState("");
  const [defaultLink, setDefaultLink] = useState("");
  const [defaultCategory, setDefaultCategory] = useState("");
  const [playlist, setPlaylist] = useState({});
  const [cnames, setCategoryNames] = useState();
  const [playlistModal, setPlaylistModal] = useState(false);
  const [list, setList] = useState();
  const [selectedForDeletion, setSelectedForDeletion] = useState(false);
  let categoryNames = [];
  let toBeDeleted = [];
  let count = 0;
  useEffect(() => {
    getCards();
    window.addEventListener("keydown", (event) => {
      if (event.key === "Delete" && count === 0) {
        count++;
        console.log(list);
      }
    });
  }, []);

  function getCards() {
    fetch("http://localhost:3000/user")
      .then((res) => res.json())
      .then((json) => {
        const byCategory = json.groupBy((card) => card.category);
        categoryNames = [];
        Object.keys(byCategory).forEach(function (prop) {
          categoryNames.push(prop);
        });
        setCategoryNames(categoryNames);
        setPlaylist(byCategory);
        setAllCards(json);
      });
    // console.log(byCategory);
  }
  function getHistory() {
    fetch("http://localhost:5000/history")
      .then((res) => res.json())
      .then((json) => {
        json.sort((a, b) => {
          let x = a["timestamp"];
          let y = b["timestamp"];
          return x > y ? -1 : x < y ? 1 : 0;
        });
        setViewHistory(json);
      });
  }
  function unique() {
    const x = Date.now();
    return x;
  }

  function handleDelete(id) {
    fetch("http://localhost:3000/user/" + id, {
      method: "DELETE",
    }).then((res) => {
      if (res.ok) {
        window.location.reload();
      }
    });
  }
  const handleUpdateCard = (e, id) => {
    e.preventDefault();
    console.log(id);
    const body = {
      id,
      cardName: defaultName,
      videoLink: defaultLink,
      category: defaultCategory,
    };
    fetch("http://localhost:3000/user/" + id, {
      method: "PUT",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(body),
    }).then((res) => {
      if (res.ok) {
        window.location.reload();
      } else {
        alert(res);
      }
    });
  };
  const handleEditCard = (card) => {
    setEditModal(true);
    setDefaultCard(card);
    setDefaultName(card.cardName);
    setDefaultLink(card.videoLink);
    setDefaultCategory(card.category);
  };
  const handleCreateCard = () => {
    setModalClicked(true);
    setCreateCard(!createCard);
  };
  const handleClose = () => {
    setModalClicked(false);
    setCreateCard(false);
  };
  const handleCloseVideo = () => {
    setVideoModal(false);
    setViewVideo(false);
  };
  const handleClose3 = () => {
    setEditModal(false);
  };
  const handleClose4 = () => {
    setHistoryModal(false);
  };
  const handleClose5 = () => {
    setPlaylistModal(false);
  };
  const handleCardCreation = (e) => {
    e.preventDefault();
    if (cardName === "") {
      alert("Please provide Card Name");
    } else if (videoLink === "") {
      alert("Please provide Video Link");
    } else if (category === "") {
      alert("Please provide Card Category");
    } else {
      const id = unique();
      const body = { id, cardName, videoLink, category };
      fetch("http://localhost:3000/user", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(body),
      }).then((res) => {});
      setCardName("");
      setVideoLink("");
      setCategory("");
      setModalClicked(false);
      setCreateCard(false);
      window.location.reload();
    }
  };
  function handleViewVideo(videoLink, name) {
    console.log(name);
    let url = "https://www.youtube.com/embed/";
    var id = videoLink.substring(videoLink.lastIndexOf("=") + 1);
    url += id;
    setVideoUrl(url);
    const body = {
      id: Date.now().toString(16),
      name: name,
      link: videoLink,
      timestamp: Date.now(),
    };
    fetch("http://localhost:5000/history", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(body),
    }).then((res) => {
      console.log(res);
    });
    setVideoModal(true);
    setViewVideo(true);
  }
  const handleViewHistory = () => {
    getHistory();
    setHistoryModal(true);
  };

  const handlePlaylist = () => {
    setPlaylistModal(true);
  };

  const handleSelectForDelete = (id) => {
    if (toBeDeleted.includes(id)) {
      const index = toBeDeleted.indexOf(id);
      if (index >= 0) {
        toBeDeleted.splice(index, 1);
      }
    } else {
      toBeDeleted.push(id);
    }
    setSelectedForDeletion(true);
  };
  const handleDeleteMultiple = () => {
    toBeDeleted.forEach((element) => {
      const q = allCards.find((x) => x.id === element);
      if (window.confirm(`Are you sure you want to delete ${q.cardName}?`)) {
        handleDelete(element);
      } else {
      }
    });
  };
  function date(timestamp) {
    let x = new Date(timestamp);
    let y = x.toLocaleString("en-IN");
    return y;
  }
  return (
    <div className="create-card">
      {viewVideo && (
        <div className="video">
          <button className="close" onClick={handleCloseVideo}>
            <span>&times;</span>
          </button>
          <Iframe
            url={videoUrl}
            width="740px"
            height="420px"
            id=""
            className=""
            display="block"
            position="relative"
          />
        </div>
      )}
      {historyModal && (
        <div className="history">
          <h1 className="heading-all">View History</h1>
          <br />
          <button className="close-1" onClick={handleClose4}>
            <span>
              <KeyboardBackspaceIcon
                sx={{ cursor: "pointer" }}
                style={{ color: "black" }}
              />
            </span>
          </button>
          <br />
          <div className="view-history">
            {viewHistory.length &&
              viewHistory.map((history) => (
                <div className="single-card" key={uid()}>
                  <p>
                    <span className="card-details">Card Name:</span>{" "}
                    {history.name}
                  </p>
                  <p className="link">
                    <span className="card-details">Link:</span>
                    <u>{history.link}</u>
                  </p>
                  <p>
                    <span className="card-details">Time:</span>{" "}
                    {date(history.timestamp)}
                  </p>
                </div>
              ))}
          </div>
        </div>
      )}
      {playlistModal && (
        <div className="history">
          <h1 className="heading-all">Playlists</h1>
          <br />
          <div onClick={handleDeleteMultiple} style={{cursor:"pointer"}}>
            <h1 className="heading-all-1">Delete Selected</h1>
          </div>
          <button className="close-1" onClick={handleClose5}>
            <span>
              <KeyboardBackspaceIcon
                sx={{ cursor: "pointer" }}
                style={{ color: "black" }}
              />
            </span>
          </button>
          <br />
          <div className="view-history">
            {cnames.length &&
              cnames.map((category) => (
                <div className="single-card-playlist" key={uid()}>
                  <h1>{category}</h1>
                  {playlist[category].map((each) => (
                    <div key={uid()}>
                      <hr className="hr" />
                      <div onClick={() => handleSelectForDelete(each.id)}>
                        <p
                          className="x"
                          style={{
                            width: "fit-content",
                            cursor: "pointer",
                          }}
                        >
                          <span className="card-details">From:</span>{" "}
                          {each.cardName}
                        </p>
                      </div>
                      <p
                        className="link"
                        onClick={() =>
                          handleViewVideo(each.videoLink, each.cardName)
                        }
                      >
                        <span className="card-details">Link:</span>
                        <u>{each.videoLink}</u>
                      </p>
                    </div>
                  ))}
                </div>
              ))}
          </div>
        </div>
      )}
      <div
        className="everything"
        style={{
          display:
            !videoModal && !historyModal && !playlistModal ? "block" : "none",
        }}
      >
        <div>
          <h1 className="heading-all">All Cards</h1>
        </div>
        <br />
        <div className="navbar">
          <button className="create-card-btn" onClick={handleCreateCard}>
            <h1
              style={{ display: modalClicked && "none" }}
              className="heading-all-1"
            >
              Create Card
            </h1>
          </button>
          <button className="create-card-btn" onClick={handleViewHistory}>
            <h1 className="heading-all-1">History</h1>
          </button>
          <button className="create-card-btn" onClick={handlePlaylist}>
            <h1 className="heading-all-1">Playlists</h1>
          </button>
        </div>
        <div className="all-cards">
          {allCards.length &&
            allCards.map((card) => (
              <div className="single-card" key={uid()}>
                <p>
                  <span className="card-details">Card Name:</span>{" "}
                  {card.cardName}
                </p>
                <p
                  className="link"
                  onClick={() => handleViewVideo(card.videoLink, card.cardName)}
                >
                  <span className="card-details">Link:</span>
                  <u>{card.videoLink}</u>
                </p>
                <p>
                  <span className="card-details">Category:</span>{" "}
                  {card.category}
                </p>
                <div className="actions">
                  <div className="delete-action">
                    <span className="delete-span">
                      <DeleteIcon
                        sx={{ cursor: "pointer" }}
                        onClick={() => handleDelete(card.id)}
                      />
                    </span>
                  </div>
                  <div className="edit-action">
                    <span className="edit-span">
                      <EditIcon
                        sx={{ cursor: "pointer" }}
                        onClick={() => handleEditCard(card)}
                      />
                    </span>
                  </div>
                </div>
              </div>
            ))}
        </div>
        {editModal && (
          <div
            className="card"
            style={{ display: editModal ? "block" : "none" }}
          >
            <div className="card-content">
              <button className="close" onClick={handleClose3}>
                <span>&times;</span>
              </button>
              <br />
              <form className="card-form">
                <input
                  type="text"
                  placeholder="Card Name"
                  value={defaultName}
                  onChange={(e) => setDefaultName(e.target.value)}
                />
                <input
                  type="text"
                  placeholder="Video Link"
                  value={defaultLink}
                  onChange={(e) => setDefaultLink(e.target.value)}
                />
                <input
                  type="text"
                  placeholder="Category (Entertainment, Education, etc.)"
                  value={defaultCategory}
                  onChange={(e) => setDefaultCategory(e.target.value)}
                />
                <button
                  className="form-create-card-btn"
                  onClick={(e) => handleUpdateCard(e, defaultCard.id)}
                  type="submit"
                >
                  Update Card
                </button>
              </form>
            </div>
          </div>
        )}

        {createCard && (
          <div
            className="card"
            style={{ display: modalClicked ? "block" : "none" }}
          >
            <div className="card-content">
              <button className="close" onClick={handleClose}>
                <span>&times;</span>
              </button>
              <br />
              <form className="card-form">
                <input
                  type="text"
                  placeholder="Card Name"
                  value={cardName}
                  onChange={(e) => setCardName(e.target.value)}
                />
                <input
                  type="text"
                  placeholder="Video Link"
                  value={videoLink}
                  onChange={(e) => setVideoLink(e.target.value)}
                />
                <input
                  type="text"
                  placeholder="Category (Entertainment, Education, etc.)"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                />
                <button
                  className="form-create-card-btn"
                  onClick={handleCardCreation}
                  type="submit"
                >
                  Create Card
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default CreateCard;
