/**
 * Main application code for Amplify React app:(Following AWS Modules)
 * Purpose of this code is to learn and implement the main functions to allow the user to create an account
 * Add characters, look up already created characters, and delete them.
 * Includes Character Name, Alias, Description, abilities, and image.
 * @version 1.0
 * @author Hiram Miranda <mirandahiram2001@gmail.com>
 */

import React, { useState, useEffect } from "react";
import "./App.css";
import "@aws-amplify/ui-react/styles.css";
import { API, Storage } from "aws-amplify";
import {
  Button,
  Flex,
  Heading,
  Image,
  Text,
  TextField,
  View,
  withAuthenticator,
} from "@aws-amplify/ui-react";
import { listNotes } from "./graphql/queries";
import {
  createNote as createNoteMutation,
  deleteNote as deleteNoteMutation,
} from "./graphql/mutations";
import { listTeams } from "./graphql/queries";
import {
  createTeam as createTeamMutation,
  deleteTeam as deleteTeamMutation,
} from "./graphql/mutations";

const App = ({ signOut }) => {
  //variables that are utilized to define the system's status
  const [notes, setNotes] = useState([]);
  const [teams,setTeams]= useState([]);
  const [menuOption, setMenuOption] = useState(null);
  const [selectedEntry, setSelectedEntry] = useState(null);
  const [selectedTeamEntry, setSelectedTeamEntry] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [teamSearchTerm, setTeamSearchTerm] = useState("");
  const [teamSearchResults, setTeamSearchResults]=useState([]);

  //When the components are already in place, this allows them to be fetch
  useEffect(() => {
    fetchNotes();
    fetchTeams();
  }, []);

  async function fetchTeams() {
    const apiData = await API.graphql({ query: listTeams });
    const teamsFromAPI = apiData.data.listTeams.items;
    await Promise.all(
      teamsFromAPI.map(async (team) => {
        if (team.image) {
          const url = await Storage.get(team.name);
          team.image = url;
        }
        return team;
      })
    );
      //Sets the state of the notes using the fetch information
    setTeams(teamsFromAPI);
    setMenuOption("entriesTeam");
  }
  //This function allows to fetch notes from the Api, and fetch the images for each note
  async function fetchNotes() {
    const apiData = await API.graphql({ query: listNotes });
    const notesFromAPI = apiData.data.listNotes.items;
    await Promise.all(
      notesFromAPI.map(async (note) => {
        if (note.image) {
          const url = await Storage.get(note.name);
          note.image = url;
        }
        return note;
      })
    );
      //Sets the state of the notes using the fetch information
    setNotes(notesFromAPI);
    setMenuOption("entries");
  }
  /**This function allows the user to create a note, asking for the name, alies,description
   * abilities and the image
  */
  async function createNote(event) {
    event.preventDefault();
    const form = new FormData(event.target);
    const image = form.get("image");
    const data = {
      name: form.get("name"),
      alias: form.get("alias"),
      description: form.get("description"),
      abilities: form.get("abilities"),
      affiliations: form.get("affiliations"),
      location: form.get("location"),
      image: image.name,
    };
    //Allows the user to upload the image from storage
    if (!!data.image) await Storage.put(data.name, image);
    //Using the API mutation, create a new note.
    await API.graphql({
      query: createNoteMutation,
      variables: { input: data },
    });
    //fetch the new updated list of notes
    fetchNotes();
    //resets the form, that way the user can add new notes
    event.target.reset();
  }

  async function createTeam(event) {
    event.preventDefault();
    const form = new FormData(event.target);
    const image = form.get("image");
    const data = {
      name: form.get("name"),
      leader: form.get("leader"),
      headquarters: form.get("headquarters"),
      members: form.get("members"),
      info: form.get("info"),
      image: image.name,
    };
    //Allows the user to upload the image from storage
    if (!!data.image) await Storage.put(data.name, image);
    //Using the API mutation, create a new note.
    await API.graphql({
      query: createTeamMutation,
      variables: { input: data },
    });
    //fetch the new updated list of notes
    fetchTeams();
    //resets the form, that way the user can add new notes
    event.target.reset();
  }

  async function deleteNoteHandler(note) {
    //This function handles the deleteNote function, that way we can properly delete each note
    await deleteNote(note.id, note.name);
  }
  async function deleteTeamHandler(team) {
    //This function handles the deleteNote function, that way we can properly delete each note
    await deleteTeam(team.id, team.name);
  }
  

  async function deleteNote(id, name) {
    //deletes note from the list
    const newNotes = notes.filter((note) => note.id !== id);
    setNotes(newNotes);
    await Storage.remove(name);//Removes the image from the storage
    //deletes note using the API mutation
    await API.graphql({
      query: deleteNoteMutation,
      variables: { input: { id } },
    });
  }
  async function deleteTeam ( id, name) {
    const newTeam= teams.filter((team) =>team.id !==id);
    setTeams(newTeam);
    await Storage.remove(name);
    await API.graphql({
      query: deleteTeamMutation,
      variables:{ input: {id} },
    });
  }

  //When the search input changes, update the search term state.
  function handleSearch(event) {
    setSearchTerm(event.target.value);
  }
  useEffect(() => {
    if (searchTerm.trim() === "") {
      setSearchResults([]);
    } else {
      const filteredResults = notes.filter((note) =>
        note.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setSearchResults(filteredResults);
    }
  }, [searchTerm, notes]);

  function handleTeamSearch(event) {
    setTeamSearchTerm(event.target.value);
  }
  useEffect(() => {
    if (teamSearchTerm.trim() === "") {
      setTeamSearchResults([]);
    } else {
      const filteredResults = teams.filter((team) =>
        team.name.toLowerCase().includes(teamSearchTerm.toLowerCase())
      );
      setTeamSearchResults(filteredResults);
    }
  }, [teamSearchTerm, teams]);


  const handleViewDetails = (entry) => {
    setSelectedEntry(entry);
    setMenuOption("entryDetails");
  };
  const handleTeamViewDetails=(teamEntry) => {
    setSelectedTeamEntry(teamEntry);
    setMenuOption("teamEntryDetails");
  };

  return (
    //Adds Heading to the application, including a background image located in the public folder.
    <View className="App" style={{ backgroundImage: `url(${process.env.PUBLIC_URL}/DCV2.jpg)` }}>

      <Heading level={1}>Superclopedia: Remember facts about your heroes</Heading>
    {/*main menu option where the user can select to add_create a chracter or view chracter list*/}
      {menuOption === null && (
        <>
        
          <Button onClick={() => setMenuOption("create")}>Add a Character</Button>
          <Button onClick={() => setMenuOption("createTeam")}>Add Team/Organization</Button>
          <Button onClick={() => setMenuOption("entries")}>Characters</Button>
          <Button onClick={() => setMenuOption("entriesTeam")}>Teams/Organizations</Button>
          
        </>
      )}
  {/*When selecting the create button a form will appear where the user can add the given information */}
      {menuOption === "create" && (
        <>
          <View as="form" margin="3rem 0" onSubmit={createNote}>
            <Flex direction="row" justifyContent="center">
              <TextField
                name="name"
                placeholder="Character Name"
                label="Character Name"
                labelHidden
                variation="quiet"
                required
                style={{ color: "white"}}
              />
              <TextField
                name="alias"
                placeholder="Character Alias"
                label="Character Alias"
                labelHidden
                variation="quiet"
                required
                style={{ color: "white"}}
              />
              <TextField
                name="description"
                placeholder="Character Description"
                label="Character Description"
                labelHidden
                variation="quiet"
                required
                style={{ color: "white"}}
              />
              <TextField
                name="abilities"
                placeholder="Character Abilities"
                label="Character Abilities"
                labelHidden
                variation="quiet"
                required
                style={{ color: "white"}}
              />
              <TextField
                name="affiliations"
                placeholder="Character Affiliations"
                label="Character Affiliations"
                labelHidden
                variation="quiet"
                required
                style={{ color: "white"}}
              />
              <TextField
                name="location"
                placeholder="Location"
                label="Location"
                labelHidden
                variation="quiet"
                required
                style={{ color: "white"}}
              />
              <View 
               name="image"
              as="input"
               type="file" 
               style={{ alignSelf: "end" }} 
               />
              <Button type="submit" variation="primary">
                Save Character
              </Button>
            </Flex>
          </View>
          <Button onClick={() => setMenuOption(null)}>Back to Main Menu</Button>
        </>
      )}
        {menuOption === "createTeam" && (
        <>
          <View as="form" margin="3rem 0" onSubmit={createTeam}>
            <Flex direction="row" justifyContent="center">
              <TextField
                name="name"
                placeholder="Name"
                label="Name"
                labelHidden
                variation="quiet"
                required
                style={{ color: "white"}}
              />
              <TextField
                name="leader"
                placeholder="Current Leader"
                label="Current Leader"
                labelHidden
                variation="quiet"
                required
                style={{ color: "white"}}
              />
              <TextField
                name="members"
                placeholder="Current Members"
                label="Current Members"
                labelHidden
                variation="quiet"
                required
                style={{ color: "white"}}
              />
              <TextField
                name="info"
                placeholder="info"
                label="info"
                labelHidden
                variation="quiet"
                required
                style={{ color: "white"}}
              />
              <TextField
                name="headquarters"
                placeholder="Headerquarters"
                label="Headerquarter"
                labelHidden
                variation="quiet"
                required
                style={{ color: "white"}}
              />
              <View 
               name="image"
              as="input"
               type="file" 
               style={{ alignSelf: "end" }} 
               />
              <Button type="submit" variation="primary">
                Save Team
              </Button>
            </Flex>
          </View>
          <Button onClick={() => setMenuOption(null)}>Back to Main Menu</Button>
        </>
      )}
      
  {/*If the user selects entries he can see in detailed order the information fron ther searched character */}
      {menuOption === "entries" && (
        <>
          <Heading level={2}>Characters:</Heading>
          <TextField
            name="search"
            placeholder="Search by name"
            labelHidden
            variation="quiet"
            value={searchTerm}
            onChange={handleSearch}
            style={{ color: "white"}}
          />
          <View margin="3rem 0">
            {searchResults.map((note) => (
              <Flex
                key={note.id}
                direction="row"
                justifyContent="center"
                alignItems="center"
                style={{ border: "2px solid black", padding: "1rem", marginBottom: "1rem" }}
              >
                <Text as="strong" fontWeight={700} style={{ color: "white"}}>
                  {note.name}
                </Text>
                <Button variation="link" onClick={() => handleViewDetails(note)}>
                  View Details
                </Button>
                <Button variation="danger" onClick={() => deleteNoteHandler(note)}>
                  Delete
                </Button>
              </Flex>
            ))}
          </View>
          <Button onClick={() => setMenuOption(null)}>Back to Main Menu</Button>
        </>
      )}

{menuOption === "entriesTeam" && (
        <>
          <Heading level={2}>Teams/Organizations:</Heading>
          <TextField
            name="search"
            placeholder="Search by name"
            labelHidden
            variation="quiet"
            value={teamSearchTerm}
            onChange={handleTeamSearch}
            style={{ color: "white"}}
          />
          <View margin="3rem 0">
            {teamSearchResults.map((team) => (
              <Flex
                key={team.id}
                direction="row"
                justifyContent="center"
                alignItems="center"
                style={{ border: "2px solid black", padding: "1rem", marginBottom: "1rem" }}
              >
                <Text as="strong" fontWeight={700} style={{ color: "white"}}>
                  {team.name}
                </Text>
                <Button variation="link" onClick={() => handleTeamViewDetails(team)}>
                  View Details
                </Button>
                <Button variation="danger" onClick={() => deleteTeamHandler(team)}>
                  Delete
                </Button>
              </Flex>
            ))}
          </View>
          <Button onClick={() => setMenuOption(null)}>Back to Main Menu</Button>
        </>
      )}

      {menuOption === "teamEntryDetails" && selectedTeamEntry && (
        <>
          <Heading level={2} style={{ color: "white", backgroundColor: "darkblue" }}>
      {selectedTeamEntry.name}
    </Heading>
    <Text style={{ color: "white", backgroundColor: "darkblue" }}>
      Team Leader: {selectedTeamEntry.leader}
    </Text>
    <Text style={{ color: "white", backgroundColor: "darkblue" }}>
      Base Location: {selectedTeamEntry.headquarters}
    </Text>
    <Text style={{ color: "white", backgroundColor: "darkblue" }}>
      Current Members: {selectedTeamEntry.members}
    </Text>
    {selectedTeamEntry.info && (
      <Text style={{ color: "white", backgroundColor: "darkblue" }}>
        Team/Organization Information: {selectedTeamEntry.info}
      </Text>
    )}
          {selectedTeamEntry.image && (
            <div style={{ marginBottom: '1rem' }}>
              <Image
                src={selectedTeamEntry.image}
                alt={`Visual aid for ${selectedTeamEntry.name}`}
                style={{ width: '100%', maxWidth: '400px', height: 'auto' }}
              />
            </div>
          )}

          <Button onClick={() => setMenuOption("entriesTeam")}>Back to Team list</Button>
        </>
      )}
      {menuOption === "entryDetails" && selectedEntry && (
        <>
          <Heading level={2} style={{ color: "white", backgroundColor: "darkblue" }}>
      {selectedEntry.name}
    </Heading>
    <Text style={{ color: "white", backgroundColor: "darkblue" }}>
      Alias: {selectedEntry.alias}
    </Text>
    <Text style={{ color: "white", backgroundColor: "darkblue" }}>
      Description: {selectedEntry.description}
    </Text>
    <Text style={{ color: "white", backgroundColor: "darkblue" }}>
      Abilities: {selectedEntry.abilities}
    </Text>
    <Text style={{ color: "white", backgroundColor: "darkblue" }}>
      Affiliations: {selectedEntry.affiliations}
    </Text>
    {selectedEntry.location && (
      <Text style={{ color: "white", backgroundColor: "darkblue" }}>
        Location: {selectedEntry.location}
      </Text>
    )}
          {selectedEntry.image && (
            <div style={{ marginBottom: '1rem' }}>
              <Image
                src={selectedEntry.image}
                alt={`Visual aid for ${selectedEntry.name}`}
                style={{ width: '100%', maxWidth: '400px', height: 'auto' }}
              />
            </div>
          )}

          <Button onClick={() => setMenuOption("entries")}>Back to Character list</Button>
        </>
      )}

        {/*Sign out button */}
      <Button onClick={signOut}>Sign Out</Button>
    </View>
  );
};

export default withAuthenticator(App);
