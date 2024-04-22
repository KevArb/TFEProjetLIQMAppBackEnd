const catchAsync = require('../../utils/catchAsync');
const Incident = require('../../models/incidentModels/incidentModel');
const Service = require('../../models/laboratoryModels/serviceModel')
const Supplier = require('../../models/equipmentModels/equipmentSupplierModel');
const Equipment = require('../../models/equipmentModels/equipmentModel');
const axios = require('axios').default;

exports.getLoginForm = catchAsync(async (req, res) => {
  res.status(200).render('login', {
    title: 'Login Form',
  });
});

exports.getEquipment = catchAsync(async (req, res) => { 
  const equipments = await Equipment.find().populate({
    path: 'supplier service category',
  });
 
  res.status(200).render('equipments', {
    title: 'Equipments',
    equipments,
  });
});

// exports.getEquipment = async (req, res) => { 
//   const getResponse = await axios.get('http://127.0.0.1:8000/api/equipment/')
//     .then((response) => response)
//     .catch((err) => console.log(err));

//   res.status(200).render('equipments', {
//     title: 'Equipments',
//     'equipments': getResponse,
//   });
// };

exports.getEquipmentById = catchAsync(async (req, res) => { 
  const equipment = await Equipment.findById(req.params.id).populate({
    path: 'supplier service category',
  });

  const incidents = await Incident.find({ equipment: req.params.id }).populate({
    path: 'createdBy',
  });

  res.status(200).render('equipmentDetails', {
    title: `${equipment.name}`,
    equipment,
    incidents,
  });
});

exports.updateEquipmentForm = catchAsync(async (req, res) => {
  const equipment = await Equipment.findById(req.params.id).populate({
    path: 'supplier category service',
  });

  const services = await Service.find()
  const suppliers = await Supplier.find()

  res.status(200).render('equipmentUpdateForm', {
    title: 'Equipment update',
    equipment,
    services,
    suppliers,
  });
});

exports.updateEquipment = catchAsync(async (req, res) => {
  
  // res.status(200).render('equipmentUpdateForm', {
  //   title: 'Equipment update',
  //   equipment,
  //   services,
  //   suppliers,
  // });
});



// export const updateEquipment = async () => {
//     try {
//       const res = await axios ({
//         method: 'PATCH',
//         url: 'http://127.0.0.1:8000/api/equiment/${id}',
//       });
  
//       if (res.data.status === 'success') {
//         location.reload(true);
//         window.location.href = '/';
//       }
//     } catch (err) {
//       console.log(err.response)
//       alert('Error logging out try again');
//     }
// }

