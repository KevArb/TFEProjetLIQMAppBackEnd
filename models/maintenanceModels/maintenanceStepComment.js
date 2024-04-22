const mongoose = require('mongoose');
const MaintenanceSheet = require('./maintenanceSheetModel');

const maintenaceStepComment = new mongoose.Schema(
    {
        comment: String,
        step: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'MaintenanceSteps',
        },
        commentedAt: {
            type: Date,
            default: Date.now(),
        },
        commentedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        }, 
        reasonComment: {
            type: String,
        },
        maintenanceSheet: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'MaintenanceSheet',
        }  
    }, 
    {
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
    },
)

const MaintenanceStepComment = mongoose.model(
    'maintenanceStepComment',
    maintenaceStepComment
);

module.exports = MaintenanceStepComment;