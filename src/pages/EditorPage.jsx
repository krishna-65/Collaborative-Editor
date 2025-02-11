import React, { useState, useRef, useEffect } from 'react';
import toast from 'react-hot-toast';
import ACTIONS from '../Action';
import Client from '../components/Client';
import Editor from '../components/Editor';
import { initSocket } from '../socket';
import { Navigate, useLocation, useNavigate, useParams } from 'react-router-dom';
import qs from 'qs';
import axios from 'axios';
import { languages } from '../constantsVersions';

const templates = {
  python: `# Python Template
def main():
    print("Hello, World!")

if __name__ == "__main__":
    main()`,
  gcc: `#include<stdio.h>
int main() {
    printf("Hello, World!\\n");
    return 0;
}`,
  cpp: `#include<iostream>
using namespace std;

int main() {
    cout << "Hello, World!" << endl;
    return 0;
}`,
java: `public class Main {
    public static void main(String[] args) {
        System.out.println("Hello, World!");
    }
}`,
js: `
    console.log("Hello, World!");
}`,

};

const EditorPage = () => {
  const socketRef = useRef(null);
  const codeRef = useRef(null);
  const reactNavigator = useNavigate();
  const [clients, setClients] = useState([]);
  const { roomId } = useParams();
  const query = new URLSearchParams(useLocation().search);
  const userName = query.get('userName');
  const language = query.get('language');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [output, setOutput] = useState('');
  const [load,setLoad] = useState(false);
  let lan = languages.find((langu) => langu.languageName === language);
  lan = lan || {};
  codeRef.current = templates[lan.languageId] || ''; // Default to the selected language template.

  useEffect(() => {
    setLoad(true);
    const init = async () => {
      socketRef.current = await initSocket();
      socketRef.current.on('connect_error', handleErrors);
      socketRef.current.on('connect_failed', handleErrors);

      function handleErrors(e) {
        console.log('socket error', e);
        toast.error('Socket connection failed, try again later.');
        reactNavigator('/');
      }

      socketRef.current.emit(ACTIONS.JOIN, { roomId, username: userName });

      socketRef.current.on(ACTIONS.JOINED, ({ clients, username, socketId }) => {
        if (username !== userName) {
          toast.success(`${username} joined the room.`);
        }
        setClients(clients);
        socketRef.current.emit(ACTIONS.SYNC_CODE, {
          code: codeRef.current,
          socketId,
        });
      });

      socketRef.current.on(ACTIONS.DISCONNECTED, ({ socketId, username }) => {
        toast.success(`${username} left the room.`);
        setClients((prev) => prev.filter((client) => client.socketId !== socketId));
      });
      setLoad(false);
      
    };

    init();

    return () => {
      socketRef.current.disconnect();
      socketRef.current.off(ACTIONS.JOINED);
      socketRef.current.off(ACTIONS.DISCONNECTED);
    };
  }, [roomId, userName]);

  const executeCode = () => {
    setLoading(true);
    setError('');
    const data = qs.stringify({
      code: codeRef.current,
      language: lan.languageId,
      input: '0',
    });

    const config = {
      method: 'post',
      url: 'https://api.codex.jaagrav.in',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      data,
    };
   

    axios(config)
      .then((response) => {
        setOutput(response.data.output);
        setError(response.data.error || '');
        setLoading(false);
      })
      .catch(() => {
        setError('An error occurred while executing the code.');
        setLoading(false);
      });
  };

  const copyRoomId = async () => {
    try {
      await navigator.clipboard.writeText(roomId);
      toast.success('Room ID has been copied to your clipboard');
    } catch (err) {
      toast.error('Could not copy the Room ID');
      console.error(err);
    }
  };

  const leaveRoom = () => {
    reactNavigator('/');
    window.location.reload();
};

if (load) {
  return (
    <div className="flex justify-center items-center h-screen w-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-500"></div>
    </div>
  );
}



  return (
    <div className="flex overflow-hidden h-screen">
      <div className="w-[30%] md:w-[20%] py-10 px-2 flex flex-col justify-between border-r-2 border-r-white">
        <div>
          <h2 className="font-semibold text-lg md:text-xl">Collaboration Editor</h2>
          <h3 className="my-10 font-semibold">Connected</h3>
          <div className="flex gap-2 flex-wrap">
            {clients.length>0 ?clients.map((client) => (
              <Client userName={client.username} key={client.socketId} />
            ))
          : <div className="flex justify-center items-center h-screen w-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-500"></div>
        </div>}
          </div>
        </div>
        <div className="flex flex-col gap-5">
          <button className="py-2 px-6 bg-transparent shadow rounded font-semibold bg-[#2a1a4e] text-sm md:text-md" onClick={copyRoomId}>
            Copy Room Id
          </button>
          <button className="border-blue-500 text-center border py-2 px-6 bg-transparent shadow rounded font-semibold" onClick={leaveRoom}>
            Leave
          </button>
        </div>
      </div>
      <div className="w-[70%] h-[80%] p-3">
        <button
          className={`${loading ? 'bg-green-400 pointer-events-none' : 'bg-green-600'} px-6 py-2 rounded font-semibold my-10`}
          onClick={executeCode}
        >
          Run
        </button>
        <Editor
          socketRef={socketRef}
          roomId={roomId}
       
          onCodeChange={(newCode) => {
           
            codeRef.current = newCode;
          }}
        />
        <div className="bg-[#333] p-5 mt-10 rounded h-96 overflow-y-auto">
          <h2 className="text-white font-semibold">Execution Result:</h2>
          <pre className="text-white mt-10 p-2">{output}</pre>
          {error && <p className="text-red-500 mt-10 p-2">{error}</p>}
          {loading && <p className="text-white">Loading...</p>}
        </div>
      </div>
    </div>
  );
};

export default EditorPage;
