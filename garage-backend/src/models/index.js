const User = require('./User');
const Client = require('./Client');
const Vehicle = require('./Vehicle');
const Reservation = require('./Reservation');
const Repair = require('./Repair');
const Offer = require('./Offer');

User.hasMany(Vehicle, { foreignKey: 'mecanicien_id', as: 'vehicules_assignes' });
Vehicle.belongsTo(User, { foreignKey: 'mecanicien_id', as: 'mecanicien' });

Client.hasMany(Vehicle, { foreignKey: 'client_id', as: 'vehicules' });
Vehicle.belongsTo(Client, { foreignKey: 'client_id', as: 'client' });

Client.hasMany(Reservation, { foreignKey: 'client_id', as: 'reservations' });
Reservation.belongsTo(Client, { foreignKey: 'client_id', as: 'client' });

User.hasMany(Reservation, { foreignKey: 'mecanicien_id', as: 'reservations_mecanicien' });
Reservation.belongsTo(User, { foreignKey: 'mecanicien_id', as: 'mecanicien' });

User.hasMany(Reservation, { foreignKey: 'receptionniste_id', as: 'reservations_receptionniste' });
Reservation.belongsTo(User, { foreignKey: 'receptionniste_id', as: 'receptionniste' });

Vehicle.hasOne(Repair, { foreignKey: 'vehicule_id', as: 'reparation' });
Repair.belongsTo(Vehicle, { foreignKey: 'vehicule_id', as: 'vehicule' });

User.hasMany(Repair, { foreignKey: 'mecanicien_id', as: 'reparations' });
Repair.belongsTo(User, { foreignKey: 'mecanicien_id', as: 'mecanicien' });

Reservation.hasOne(Repair, { foreignKey: 'reservation_id', as: 'reparation' });
Repair.belongsTo(Reservation, { foreignKey: 'reservation_id', as: 'reservation' });

module.exports = { User, Client, Vehicle, Reservation, Repair, Offer };
