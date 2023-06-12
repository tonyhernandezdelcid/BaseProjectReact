import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { show_alerta } from '../functions';

const ShowUsers = () => {

  const urlget = 'http://localhost:8080/baseprojectapi/consultausuarios';
  const urlpost = 'http://localhost:8080/baseprojectapi/crearusuario';
  const urlput = 'http://localhost:8080/baseprojectapi/modificarusuario';
  const urldelete = 'http://localhost:8080/baseprojectapi/eliminausuario/';
  const [users, setUsers] = useState([]);
  const [id, setId] = useState('');
  const [codigo, setCodigo] = useState('');
  const [nombre, setNombre] = useState('');
  const [telefono, setTelefono] = useState('');
  const [operation, setOperation] = useState(1);
  const [title, setTitle] = useState('');

  useEffect(() => {
    getUsers();

  }, []);

  const getUsers = async () => {
    const respuesta = await axios.get(urlget);
    setUsers(respuesta.data);


  }

  const openModal = (op, id, codigo, nombre, telefono) => {
    setId('');
    setCodigo('');
    setNombre('');
    setTelefono('');
    setOperation(op);
    if (op === 1) {
      setTitle('Registrar usuario');
    } else if (op === 2) {
      setTitle('Editar usuario');
      setId(id);
      setCodigo(codigo);
      setNombre(nombre);
      setTelefono(telefono);
    }
    window.setTimeout(function(){
      document.getElementById('codigo').focus();
    },500);
  }


  const enviarSolicitudPost = async(metodo, parametros) =>{
        
    await axios ({method:metodo, url:urlpost, data:parametros}).then(function(respuesta){
      
      
      if(respuesta.data){
        show_alerta('El usuario fue guardado exitosamente','SUCCESS');
        document.getElementById('btnCerrar').click();
        getUsers();
      }


    }).catch(function(error){
      show_alerta('Error en la solicitud', 'error');
      console.log(error);
    });
  
  
}

const enviarSolicitudPut = async(metodo, parametros) =>{
        
  await axios ({method:metodo, url:urlput, data:parametros}).then(function(respuesta){
    
    
    if(respuesta.data){
      show_alerta('El usuario fue modificado exitosamente','SUCCESS');
      document.getElementById('btnCerrar').click();
      getUsers();
    }


  }).catch(function(error){
    show_alerta('Error en la solicitud', 'error');
    console.log(error);
  });


}


const enviarSolicitudDelete = async(parametros) =>{
        
  await axios ({method:'DELETE', url:urldelete+'/'+parametros.id, data:parametros}).then(function(respuesta){
    
    
    if(respuesta.data){
      show_alerta('El usuario fue eliminado exitosamente','SUCCESS');
      document.getElementById('btnCerrar').click();
      getUsers();
    }


  }).catch(function(error){
    show_alerta('Error en la solicitud', 'error');
    console.log(error);
  });


}



const eliminarUsuario = (id, nombre)=>{
  const MySwal = withReactContent(Swal);
  MySwal.fire({
    title:'Seguro que quiere eliminar el usuario: '+nombre+'?',
    icon:'question', text:'No se podrá dar marcha atrás',
    showCancelButton:true,confirmButtonText:'Si, eliminar', cancelButtonText:'Cancelar'

  }).then((result)=>{
      if(result.isConfirmed){
        setId(id);
        enviarSolicitudDelete({id:id});
      }else{

        show_alerta('El usuairo NO fue eliminado', 'info');
      }
  })
};

  const validar = () => {
    var parametros;
    var metodo;
    if(codigo.trim()===''){
      show_alerta('Escribe el codigo del usuario', 'warning');
    }else if(nombre.trim()===''){
      show_alerta('Escribe el nombre del usuario', 'warning');
    }else if(telefono.trim()===''){
      show_alerta('Escribe el telefono del usuario', 'warning');
    }else{
      if(operation===1){
        parametros ={codigo:codigo.trim(),nombre:nombre.trim(),telefono:telefono.trim()};
        metodo='POST';
        enviarSolicitudPost(metodo,parametros);
      }else {
          parametros ={id:id.trim(),codigo:codigo.trim(),nombre:nombre.trim(),telefono:telefono.trim()};
          metodo='PUT';
          enviarSolicitudPut(metodo,parametros);
        }
        

      }

    


     


  }



  return (
    <div className='App'>
      <div className='container-fluid'>


        <div className='row mt-3'>
          <div className='col-md-4 offset-4'>
            <div className='d-grid mx-auto'>
              <button onClick={()=> openModal(1)} className='btn btn-dark' data-bs-toggle='modal' data-bs-target='#modalUsers'>
                <i className='fa-solid fa-circle-plus'></i> Añadir

              </button>


            </div>


          </div>


        </div>


        <div className='row mt-3'>
          <div className='col-12 col-lg-8 offset-0 offset-lg-2'>
            <div className='table-responsive'>
              <table className='table table-bordered'>
                <thead>
                  <tr><th>ID</th> <th>Codigo</th>  <th>Nombre</th> <th>Telefono</th>  </tr>

                </thead>

                <tbody className='table-group-divider'>
                  {users.map((user, id) => (
                    <tr key={user.id}>
                      <td>{user.id}</td>
                      <td>{user.codigo}</td>
                      <td>{user.nombre}</td>
                      <td>{user.telefono}</td>
                      <td>

                        <button onClick={() => openModal(2,user.id, user.codigo,user.nombre,user.telefono)} className='btn btn-warning' data-bs-toggle='modal'
                        data-bs-target='#modalUsers'>
                          <i className='fa-solid fa-edit'></i>
                        </button>
                        &nbsp;

                        <button onClick={() => eliminarUsuario(user.id,user.nombre)}  className='btn btn-danger'>
                          <i className='fa-solid fa-trash'></i>
                        </button>


                      </td>
                    </tr>



                  )



                  )}

                </tbody>

              </table>

            </div>

          </div>

        </div>


      </div>
      <div id='modalUsers' className='modal fade' aria-hidden='true'>

        <div className='modal-dialog'>

          <div className='modal-content'>

            <div className='modal-header'>

              <label className='h5'>{title}</label>
              <button type='button' className='btn-close' data-bs-dismiss='modal' aria-label='Close'></button>

            </div>

            <div className='modal-body'>
              <input type='hidden' id='id'></input>

              <div className='input-group mb-3'>
                <span className='input-group-text'><i className='fa-solid fa-gift'></i></span>
                <input type='text' id='codigo' className='form-control' placeholder='Codigo' value={codigo}
                  onChange={(e) => setCodigo(e.target.value)}></input>

              </div>



              <div className='input-group mb-3'>
                <span className='input-group-text'><i className='fa-solid fa-comment'></i></span>
                <input type='text' id='nombre' className='form-control' placeholder='Nombre' value={nombre}
                  onChange={(e) => setNombre(e.target.value)}></input>

              </div>



              <div className='input-group mb-3'>
                <span className='input-group-text'><i className='fa-solid fa-dollar-sign'></i></span>
                <input type='text' id='telefono' className='form-control' placeholder='Telefono' value={telefono}
                  onChange={(e) => setTelefono(e.target.value)}></input>

              </div>

              <div className='d-grid col-6 mx-auto'>

                <button onClick={()=> validar()} className='btn btn-success'>

                  <i className='fa-solid fa-floppy-disk'></i>
                </button>

              </div>

            </div>

            <div className='modal-footer'>
              <button type='button' id='btnCerrar' className='btn btn-secondary' data-bs-dismiss='modal'>Cerrar</button>

            </div>


          </div>

        </div>



      </div>


    </div>
  )
}

export default ShowUsers