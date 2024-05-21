export interface UsuarioDB {
    id:              string;
    nombre:          string;
    usuario:         string;
    clave:           string;
    estado:          boolean;
    apellido:        string;
    cargo:           null;
    identificacion:  string;
    clave_temporal:   boolean;
    correo:          string;
    telefono:        null;
    id_rol:           string;
    formularios?:{
        id:number,
        nombre:string,
        delegatura:string,
        estado:boolean
    }
}
