const { deleteFile } = require( "../../utils/deleteFile" );
const Event = require( "../models/evento" );
const Usuario = require( "../models/usuario" );

//! GET Events
const getEvents = async ( req, res, next ) => {
     try {
          const allEvents = await Event.find().populate( "user" ).populate( {
               path: "comentarios",
               populate: {
                    path: 'user',
                    model: 'usuarios'
               }
          } );
          return res.status( 200 ).json( allEvents );
     } catch ( error ) {
          return res.status( 400 ).json( error );
     }
};


//! GET Events by ID
const getEventsByID = async ( req, res, next ) => {
     try {
          const { id } = req.params;
          const eventBiId = await Event.findById( id ).populate( 'user' )
               .populate( {
                    path: 'comentarios',
                    populate: {
                         path: 'user',
                         model: 'usuarios'
                    }
               } );

          return res.status( 200 ).json( eventBiId );
     } catch ( error ) {
          return res.status( 404 ).json( "Ha fallado la recuperación del evento por ID" );

     }
};


//! GET Events by TITLE
const getEventsByTitle = async ( req, res, next ) => {
     try {
          const { title } = req.params;
          const eventByTitle = await Event.find( { title: title } ).populate( 'user' )
               .populate( {
                    path: 'comentarios',
                    populate: {
                         path: 'user',
                         model: 'usuarios'
                    }
               } );
          return res.status( 200 ).json( eventByTitle );
     } catch ( error ) {
          return res.status( 404 ).json( "Ha fallado la recuperación del evento por TITLE" );
     }
};


//! POST Events
const postEvents = async ( req, res, next ) => {
     try {
          console.log( req.body );
          const event = new Event( {
               ...req.body,
               user: req.body.user,
          } );

          if ( req.files ) {
               event.img = req.files.img[ 0 ].path;
          }

          const eventSaved = await event.save();


          await Usuario.findByIdAndUpdate(
               req.body.user,
               { $push: { eventos: eventSaved._id } },
               { new: true }
          );
          return res.status( 200 ).json( eventSaved );
     } catch ( error ) {
          return res.status( 500 ).json( { message: "Error al actualizar el usuario" } );
     }
};



//! PUT Events
const putEvents = async ( req, res, next ) => {
     try {
          const { id } = req.params;

          const oldEvent = await Event.findById( id );

          if ( req.file ) {
               if ( oldEvent.img ) {
                    await deleteFile( oldEvent.img );
               }
               req.body.img = req.file.path;
          }

          const eventUpdated = await Event.findByIdAndUpdate( id, { $set: req.body }, { new: true } );

          return res.status( 200 ).json( eventUpdated );
     } catch ( error ) {
          return res.status( 400 ).json( "Ha fallado la modificación del evento" );
     }
};






//! DELETE Events
const deleteEvents = async ( req, res, next ) => {
     try {
          const { id } = req.params;
          const eventDeleted = await Event.findByIdAndDelete( id );
          deleteFile( eventDeleted.img );

          return res.status( 200 ).json( eventDeleted );
     } catch ( error ) {
          return res.status( 400 ).json( "Ha fallado la eliminación del evento" );
     }
};

module.exports = { getEvents, getEventsByID, getEventsByTitle, postEvents, putEvents, deleteEvents };