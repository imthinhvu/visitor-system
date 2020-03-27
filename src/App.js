import React, { useEffect, useState } from 'react';
import { VisitorList } from './Visitors';
import './App.css';

/*
 * In a production application, we should not include this key here
 * due to security concerns. We could instead move this to a config file
 * which only the server hosting the application will have.
 */
const API_KEY = '149ee4ea99881a0f494c';
const VISITORS_SERVICE_ENDPOINT =
  'https://mini-visitors-service.herokuapp.com/api';

function App() {
  const [visitor, setVisitor] = useState({ name: '', notes: '' });
  const [visitorList, setVisitorList] = useState([]);
  const [showVisitors, toggleVisitors] = useState(true);

  const formatStatus = status => {
    const dateTime = new Date(status);
    return dateTime.toLocaleString();
  };

  const handleChange = event => {
    setVisitor({ ...visitor, [event.target.name]: event.target.value });
  };

  const addNewVisitor = async event => {
    event.preventDefault();
    if (visitor.name && visitor.notes) {
      const response = await fetch(`${VISITORS_SERVICE_ENDPOINT}/entries`, {
        method: 'POST',
        headers: {
          'X-API-Key': API_KEY,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          data: {
            type: 'entries',
            attributes: {
              name: visitor.name,
              notes: visitor.notes,
            },
          },
        }),
      });

      response
        .json()
        .then(() => {
          getVisitors().then();
          setVisitor({ name: '', notes: '' });
        })
        .catch(err => console.log('Oops', err));
    }

    return;
  };

  const getVisitors = async () => {
    const response = await fetch(`${VISITORS_SERVICE_ENDPOINT}/entries`, {
      method: 'GET',
      headers: {
        'X-API-Key': API_KEY,
      },
    });

    response
      .json()
      .then(visitors => {
        const { data } = visitors;
        if (data.length) {
          data.forEach(entry => {
            const { attributes = {} } = entry;
            if (attributes.sign_out && attributes.sign_out != null) {
              attributes.sign_out = formatStatus(attributes.sign_out);
            }
          });
        }
        setVisitorList(data);
      })
      .catch(err => console.log('Oops', err));
  };

  const handleSignOut = (id, event) => {
    console.log(event.target);
    signOutVisitor(id);
  };

  const signOutVisitor = async id => {
    if (isNaN(id)) {
      throw new Error(
        'Invalid ID: ',
        id,
        ' - Please provide a valid ID to sign out.'
      );
    }

    const data = JSON.stringify({
      data: {
        type: 'entries',
        id: id,
      },
    });

    const response = await fetch(
      `${VISITORS_SERVICE_ENDPOINT}/entries/sign_out`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-API-Key': API_KEY,
        },
        body: data,
      }
    );

    response
      .json()
      .then(() => {
        getVisitors();
      })
      .catch(err => console.error(err));
  };

  const showSignedOut = () => {
    if (showVisitors) {
      toggleVisitors(false);
      setVisitorList(
        visitorList.filter(
          visitor =>
            visitor && visitor.attributes && visitor.attributes.sign_out != null
        )
      );
    } else {
      getVisitors();
      toggleVisitors(true);
    }
  };

  useEffect(() => {
    getVisitors();
  }, [visitorList.id]);

  return (
    <div className="App container mx-auto mt-12 p-8 border min-h-screen max-w-3xl">
      <div className="clearfix">
        <button
          className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded inline-flex items-center float-right ml-2"
          onClick={showSignedOut}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            width="24"
            height="24"
          >
            <path d="M17.56 17.66a8 8 0 0 1-11.32 0L1.3 12.7a1 1 0 0 1 0-1.42l4.95-4.95a8 8 0 0 1 11.32 0l4.95 4.95a1 1 0 0 1 0 1.42l-4.95 4.95zm-9.9-1.42a6 6 0 0 0 8.48 0L20.38 12l-4.24-4.24a6 6 0 0 0-8.48 0L3.4 12l4.25 4.24zM11.9 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm0-2a2 2 0 1 0 0-4 2 2 0 0 0 0 4z" />
          </svg>
          <span className="ml-2">
            {showVisitors ? 'Show Signed Out Visitors' : 'Show All Visitors'}
          </span>
        </button>

        <img
          src="https://dashboard.envoy.com/assets/images/logo-small-red-ba0cf4a025dd5296cf6e002e28ad38be.svg"
          alt="Envoy Logo"
          width="31"
          className="py3 block"
        />
      </div>
      <form
        className="flex items-center justify-between my-8 mb-2"
        onSubmit={addNewVisitor}
      >
        <label htmlFor="name">Name</label>
        <input
          className="border border-black p-2"
          name="name"
          type="text"
          placeholder="Name"
          value={visitor.name}
          onChange={handleChange}
        />
        <label htmlFor="notes">Notes</label>
        <input
          className="border border-black p-2"
          name="notes"
          type="text"
          placeholder="Notes"
          value={visitor.notes}
          maxLength="140"
          onChange={handleChange}
        />
        <button
          className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded inline-flex items-center float-right ml-2"
          type="submit"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            width="24"
            height="24"
          >
            <path d="M19 10h2a1 1 0 0 1 0 2h-2v2a1 1 0 0 1-2 0v-2h-2a1 1 0 0 1 0-2h2V8a1 1 0 0 1 2 0v2zM9 12A5 5 0 1 1 9 2a5 5 0 0 1 0 10zm0-2a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm8 11a1 1 0 0 1-2 0v-2a3 3 0 0 0-3-3H7a3 3 0 0 0-3 3v2a1 1 0 0 1-2 0v-2a5 5 0 0 1 5-5h5a5 5 0 0 1 5 5v2z" />
          </svg>
          <span className="ml-2">New Visitor</span>
        </button>
      </form>
      <VisitorList visitors={visitorList} signOutVisitor={handleSignOut} />
    </div>
  );
}

export default App;
