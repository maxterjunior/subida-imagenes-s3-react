import { useState } from 'react'
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
// import './App.css'

const envs = {

  // // Bomarea
  // api: 'https://8uawkhp4lk.execute-api.us-east-1.amazonaws.com/api/images-upload',
  // bucket: 'https://s3.amazonaws.com/sanidad-2023',
  // token:')H@McQfTjWnZr4u7w!z%C*F-JaNdRgUk'
  // folder:'sanidad/2023'

  // Lite | Neo
  api: 'https://tpo20dad94.execute-api.us-east-1.amazonaws.com/api/images-upload',
  // api:'http://localhost:3054/api/imagenes-upload',
  bucket: 'https://pe-agritracer-files-neo-qas.s3.amazonaws.com/',
  token: 'NgH^d!QYa|-m4M31PB1:x3?-Y>nY~h',
  folder: 'trabajadores'
}

function App() {
  const [archivo, setArchivo] = useState<any>(null);
  const [mensaje, setMensaje] = useState('');
  const [img, setImg] = useState<any>(null);

  const manejarCambioArchivo = (evento) => {
    setArchivo(evento.target.files[0]);
  };

  const enviarArchivo = () => {

    setMensaje('Enviando archivo...');

    if (!archivo) {
      setMensaje('No se ha seleccionado ningún archivo');
      return;
    }

    let formData = new FormData();

    const file = new File([archivo], Date.now() + archivo.name, { type: archivo.type });

    formData.append('folder', envs.folder);
    formData.append('content', file);

    fetch(envs.api, {
      method: 'POST',
      headers: {
        'Authorization': envs.token
      },
      body: formData,
      // mode: 'no-cors'
    })
      .then(response => {
        if (response.ok) {
          setMensaje('El archivo se ha enviado correctamente');
          setImg(envs.bucket + envs.folder + '/' + file.name);
        } else {
          // console.warn(response.status);
          setMensaje('Ha ocurrido un error al enviar el archivo ' + response.status + ' ' + response.statusText);
        }
      })
      .catch(error => {
        setMensaje('Ha ocurrido un error al enviar el archivo: ' + error.message);
      });
  };

  return (
    <div className='subir-archivo'>
      <h2>Subir archivo</h2>
      <input type="file" onChange={manejarCambioArchivo} accept="image/*" />
      <button onClick={enviarArchivo}>Enviar archivo</button>
      <p>{mensaje}</p>
      {img ? <img src={img} alt="Imagen" /> : null}
    </div>
  );
}

export default App
