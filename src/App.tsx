import { useState, useEffect, useCallback } from "react";
import { BiCalendar } from "react-icons/bi";
import { Search } from "./components/Search";
import { AddAppintment } from "./components/AddAppointment";
import React from "react";
import { AppointmentInfo } from "./components/AppointmentInfo";

function App() {
  let [appointemntList, setAppointmentList] = useState<any[]>([]);
  let [query, setQuery] = useState("");
  let [sortBy, setSortBy] = useState("petName");
  let [orderBy, setOrderBy] = useState("asc");

  const filteredAppointments = appointemntList.filter(
    item => {
      return (
        item.petName.toLowerCase().includes(query.toLowerCase()) || 
        item.ownerName.toLowerCase().includes(query.toLowerCase()) || 
        item.aptNotes.toLowerCase().includes(query.toLowerCase())
      )
    }
  ).sort((a, b) => {
    let order = (orderBy === 'asc') ? 1 : -1;
    return (
      a[sortBy].toLowerCase() < b[sortBy].toLowerCase()
        ? -1 * order : 1 * order 
    )
  })

  const fetchData = useCallback(() => {
    fetch('./data.json')
    .then(response => response.json())
    .then(data => {
      setAppointmentList(data)
    })
  }, []);

  useEffect(() => {
    fetchData()
  }, [fetchData]);

  return (
    <div className="App container mx-auto mt-3 font-thin">
      <h1 className="text-5xl mb-3">
        <BiCalendar className="inline-block text-red-400 alight-top" />Your Appointments
      </h1>
      <AddAppintment 
        onSendAppointment={myAppointment => setAppointmentList([...appointemntList, myAppointment])}
        lastId={appointemntList.reduce((max, item) => Number(item.id) > max ? Number(item.id) : max, 0)}
      />
      <Search query={query}
       onQueryChange={myQuery => setQuery(myQuery)}
       orderBy={orderBy}
       onOrderByChange={mySort => setOrderBy(mySort)}
       sortBy={sortBy}
       onSortByChange={mySort => setSortBy(mySort)}
       />

      <ul className="devide-y devide-gray-200">
        {
          filteredAppointments.map(appointment => {
            return <AppointmentInfo 
            key={appointment.id} 
            appointment={appointment}
            onDeleteAppointment={
              appointmentId => {
                setAppointmentList(
                  appointemntList
                  .filter(
                    appointment => appointment.id !== appointmentId
                    )
                  )
              }
            }
            />
          })
        }
      </ul>
    </div>
  );
}

export default App;
