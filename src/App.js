import { useState } from "react";

const initialFriends = [
  {
    id: 118836,
    name: "Clark",
    image: "https://i.pravatar.cc/48?u=118836",
    balance: -7,
  },
  {
    id: 933372,
    name: "Sarah",
    image: "https://i.pravatar.cc/48?u=933372",
    balance: 20,
  },
  {
    id: 499476,
    name: "Anthony",
    image: "https://i.pravatar.cc/48?u=499476",
    balance: 0,
  },
];

export default function App() {
  const [friends, setFriends] = useState(initialFriends);
  const [showAddFriend, setAddFriend] = useState(false);
  const [selectedFriend, setSelectedFriend] = useState(null);
  function handlerAddFreind() {
    setAddFriend(!showAddFriend);
  }
  function hanndleFriends(friend) {
    setFriends((friends) => [...friends, friend]);
  }

  function handleSelectedFriend(friend) {
    setSelectedFriend((curr) => (curr?.id === friend.id ? null : friend));
    setAddFriend(false);
  }
  function handleSplitBill(value) {
    console.log(value);
    setFriends((friends) =>
      friends.map((friend) =>
        friend.id === selectedFriend.id
          ? { ...friend, balance: friend.balance + value } // ...friend means rest property of friend is same
          : friend
      )
    );
    setSelectedFriend(null);
  }
  return (
    <div className="app">
      <div className="sidebar">
        <FriendList
          friends={friends}
          onSelectedFriend={handleSelectedFriend}
          selectedFriend={selectedFriend}
        />

        {showAddFriend && <FormAddFriend hanndleFriends={hanndleFriends} />}

        <Button onClick={handlerAddFreind}>
          {" "}
          {showAddFriend ? "Close" : "Add"}
        </Button>
      </div>

      {selectedFriend && (
        <FormSplitBill
          selectedFriend={selectedFriend}
          onSplitBill={handleSplitBill}
        />
      )}
    </div>
  );
}

function FriendList({ friends, onSelectedFriend, selectedFriend }) {
  return (
    <ul>
      {friends.map((friend) => (
        <Friend
          friend={friend}
          onSelectedFriend={onSelectedFriend}
          selectedFriend={selectedFriend}
        />
      ))}
    </ul>
  );
}

function Friend({ friend, onSelectedFriend, selectedFriend }) {
  const isSelected = selectedFriend?.id === friend.id;
  return (
    <li className={isSelected ? "selected" : ""}>
      <img src={friend.image} alt="friend" />
      <h3>{friend.name}</h3>

      {friend.balance < 0 ? (
        <p className="red">
          You owe {friend.name} {friend.balance}€
        </p>
      ) : friend.balance > 0 ? (
        <p className="green">
          {friend.name} owe you {Math.abs(friend.balance)}€{" "}
        </p>
      ) : (
        <p> You and {friend.name} are even</p>
      )}

      <Button onClick={() => onSelectedFriend(friend)}>
        {isSelected ? "Close" : "Select"}
      </Button>
    </li>
  );
}

function Button({ children, onClick }) {
  return (
    <button className="button" onClick={onClick}>
      {children}
    </button>
  );
}

function FormAddFriend({ hanndleFriends }) {
  const [name, setName] = useState("");
  const [image, setImage] = useState("https://i.pravatar.cc/48");

  function handleSubmit(e) {
    e.preventDefault();
    const id = crypto.randomUUID();
    const newFriend = {
      name,
      image: `${image}?=${id}`, //as the above link always generate random image so we want fixed image for particular user
      //so we do this
      balance: 0,
      id,
    };
    setName("");
    setImage("https://i.pravatar.cc/48");
    hanndleFriends(newFriend);
  }

  return (
    <form className="form-add-friend" onSubmit={handleSubmit}>
      <label>🧍‍♀️Name</label>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <label>🏞️ Image URL</label>
      <input
        type="text"
        value={image}
        onChange={(e) => setImage(e.target.value)}
      />

      <Button>Add Friend</Button>
    </form>
  );
}

function FormSplitBill({ selectedFriend, onSplitBill }) {
  const [bill, setBill] = useState("");
  const [paidByUserr, setPaidByUser] = useState("");
  const paidByFriend = bill - paidByUserr;
  const [whoIsPaying, setWhoIsPaing] = useState("user");

  function handleSubmit(e) {
    e.preventDefault();
    if (!bill && !paidByUserr) return;
    onSplitBill(whoIsPaying === "user" ? paidByFriend : -paidByUserr);
  }
  return (
    <form className="form-split-bill">
      <h2>split A bill with {selectedFriend.name}</h2>
      <label>💵 Bill Value</label>
      <input
        type="text"
        value={bill}
        onChange={(e) => setBill(Number(e.target.value))}
      />
      <label>🧍‍♂️Your Expense</label>
      <input
        type="text"
        value={paidByUserr}
        onChange={(e) =>
          setPaidByUser(
            Number(e.target.value) > bill ? paidByUserr : Number(e.target.value)
          )
        }
      />
      <label>🧑‍🤝‍🧑{selectedFriend.name}'s Expense</label>
      <input type="text" disabled value={paidByFriend} />
      <label>🤑 How's paying the bill</label>
      <select
        value={whoIsPaying}
        onChange={(e) => setWhoIsPaing(e.target.value)}
      >
        <option value="user"> You</option>
        <option value="friend">{selectedFriend.name}</option>
      </select>
      <Button onClick={handleSubmit}>Split Bill</Button>
    </form>
  );
}
