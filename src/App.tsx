import HomePage from "./Pages/Home";
import NewResource from "./Pages/NewResource";
import ToDoList from "./Pages/ToDoList";
import { useState, useEffect } from "react";
import { IUser } from "./interfaces";
import { Routes, Route, NavLink } from "react-router-dom";
import { IResource } from "./interfaces";
import axios from "axios";
import { Resource } from "./Pages/Resource";
import "./App.css";
import { useLocalStorage } from "./utils/localStorage";

export const url =
  process.env.NODE_ENV === "production"
    ? "https://coding-resources-backend.onrender.com"
    : "http://localhost:4000";

function App(): JSX.Element {
  const [userID, setUserID] = useLocalStorage("userID", null);
  const [users, setUsers] = useState<IUser[]>([]);
  const [allResources, setAllResources] = useState<IResource[]>([]);
  useEffect(() => {
    const userNamesCompleteURL = url + "/users";
    const resourcesURL = url + "/resources";

    const fetchAllResources = async () => {
      const { data } = await axios.get(resourcesURL);
      setAllResources(data);
    };
    const fetchUserNames = async () => {
      const { data } = await axios.get(userNamesCompleteURL);
      setUsers(data);
    };
    fetchUserNames();
    fetchAllResources();
  }, []);

  return (
    <div>
      <div className="navbar">
        <NavLink to="/">Homepage</NavLink>

        {userID && (
          <NavLink className="add-resource" to="/add-resource">
            Add Resource
          </NavLink>
        )}

        {userID && <NavLink to={`/to-do-list/${userID}`}>To-Do List</NavLink>}
      </div>
      <Routes>
        <Route
          path="/"
          element={
            <HomePage
              resources={allResources}
              users={users}
              userID={userID}
              setUserID={setUserID}
            />
          }
        />
        <Route path="/add-resource" element={<NewResource userID={userID} />} />
        <Route
          path="/to-do-list/:userID"
          element={<ToDoList userID={userID} />}
        />
        <Route
          path="/resource/:resourceID"
          element={
            allResources.length > 0 ? (
              <Resource
                users={users}
                allResources={allResources}
                userID={userID}
              />
            ) : (
              <></>
            )
          }
        />
      </Routes>
    </div>
  );
}

export default App;
