import { useEffect, useState } from 'react'
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
// import './App.css'

// const envs = {

//   // // Bomarea
//   // api: 'https://8uawkhp4lk.execute-api.us-east-1.amazonaws.com/api/images-upload',
//   // bucket: 'https://s3.amazonaws.com/sanidad-2023',
//   // token:')H@McQfTjWnZr4u7w!z%C*F-JaNdRgUk'
//   // folder:'sanidad/2023'

//   // Lite | Neo
//   // Qas
//   // api: 'https://tpo20dad94.execute-api.us-east-1.amazonaws.com/api/images-upload',
//   // bucket: 'https://pe-agritracer-files-neo-qas.s3.amazonaws.com/',

//   // api: 'https://szbweansn0.execute-api.us-east-1.amazonaws.com/api/images-upload',
//   // bucket: 'https://pe-agritracer-files-neo-prod.s3.amazonaws.com/',  

//   // api:'http://localhost:3054/api/imagenes-upload',

//   // api:'https://3ghp089rha.execute-api.us-east-1.amazonaws.com/api/s3-upload',
//   // api:'http://localhost:3000/api/s3-upload',
//   // bucket:'https://constru-tools-public-files.s3.amazonaws.com/',
//   // token: 'NgH^d!QYa|-m4M31PB1:x3?-Y>nY~h',

//   api: 'https://cved1vm8ue.execute-api.us-east-1.amazonaws.com/api/imagenes-upload',
//   bucket: 'https://workapp-safco-public-files-qas.s3.amazonaws.com/',
//   token: '04c82c94-ea23-48e3-bf50-9404c1bc1def',
//   folder: 'compras'
// }

function App() {
  const [archivo, setArchivo] = useState<any>(null);
  const [img, setImg] = useState<any>(null);
  const [mensaje, setMensaje] = useState('');
  const [params, setParams] = useState<{ api: string, bucket: string, token: string, folder: string }>({
    api: 'https://xxx.execute-api.us-east-1.amazonaws.com/api/imagenes-upload',
    bucket: 'https://example.s3.amazonaws.com/',
    token: 'xxxxx',
    folder: 'test'
  } as any);

  // useEffect(() => {
  //   localStorage.setItem('params', JSON.stringify(params));
  // }, [params]);

  // useEffect(() => {
  //   const params = localStorage.getItem('params');
  //   if (params) {
  //     setParams(JSON.parse(params));
  //   }
  // }, []);

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

    // Si el archivo es mayor a 6MB no se envía
    if (file.size > 6000000) {
      setMensaje('El archivo es demasiado grande');
      return;
    }

    formData.append('folder', params.folder);
    formData.append('content', file);

    fetch(params.api, {
      method: 'POST',
      headers: {
        'Authorization': params.token
      },
      body: formData,
    })
      .then(response => {
        if (response.ok) {
          setMensaje('El archivo se ha enviado correctamente');
          setImg(params.bucket + params.folder + '/' + file.name);
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
      <form
        onSubmit={e => {
          e.preventDefault()
        }}
        style={{ display: 'flex', flexDirection: 'column', width: '50%', margin: '20px 0' }}
      >
        <label htmlFor='api'>API</label>
        <input
          id='api'
          type='text'
          value={params.api}
          onChange={e => setParams({ ...params, api: e.target.value })}
        />
        <label htmlFor='bucket'>Bucket</label>
        <input
          id='bucket'
          type='text'
          value={params.bucket}
          onChange={e => setParams({ ...params, bucket: e.target.value })}
        />
        <label htmlFor='token'>Token</label>
        <input
          id='token'
          type='text'
          value={params.token}
          onChange={e => setParams({ ...params, token: e.target.value })}
        />
        <label htmlFor='folder'>Folder</label>
        <input
          id='folder'
          type='text'
          value={params.folder}
          onChange={e => setParams({ ...params, folder: e.target.value })}
        />
      </form>
      <input type="file" onChange={manejarCambioArchivo} accept="image/*" />
      <button onClick={enviarArchivo}>Enviar archivo</button>
      <p>{mensaje}</p>
      {img ? <img src={img} alt="Imagen" /> : null}
    </div>
  );
}

export default App
