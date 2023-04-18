const mongoose = require('mongoose')
const geocoder = require('../utils/geocoder')
const slugify = require('slugify')

const UserSchema = new mongoose.Schema(
    {
      name: {
        type: String,
        required: [true, 'Please add a name'],
        unique: true,
        trim: true,
        maxlength: [50, 'Name can not be more than 50 characters']
      },
      slug: String,
      website: {
        type: String,
        match: [
          /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/,
          'Please use a valid URL with HTTP or HTTPS'
        ]
      },
      phone: {
        type: String,
        maxlength: [20, 'Phone number can not be longer than 20 characters'],
        required: [true, 'Please add phone number']
      },
      email: {
        type: String,
        match: [
          /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
          'Please add a valid email'
        ],
        required: [true, 'Please add email address']
      },
      address: {
        type: String,
        required: [true, 'Please add an address']
      },
      location: {
        // GeoJSON Point
        type: {
          type: String,
          enum: ['Point']
        },
        coordinates: {
          type: [Number],
          index: '2dsphere'
        },
        formattedAddress: String,
        street: String,
        city: String,
        state: String,
        zipcode: String,
        country: String
      },
      createdAt: {
        type: Date,
        default: Date.now
      }
    },
    {
      toJSON: { virtuals: true },
      toObject: { virtuals: true }
    }
  );
  
  // Create bootcamp slug from the name
  UserSchema.pre('save', function(next) {
    this.slug = slugify(this.name, { lower: true });
    next();
  });
  
  // Geocode & create location field
  UserSchema.pre('save', async function(next) {
    const loc = await geocoder.geocode(this.address);
    this.location = {
      type: 'Point',
      coordinates: [loc[0].longitude, loc[0].latitude],
      formattedAddress: loc[0].formattedAddress,
      street: loc[0].streetName,
      city: loc[0].city,
      state: loc[0].stateCode,
      zipcode: loc[0].zipcode,
      country: loc[0].countryCode
    };
  
    // Do not save address in DB
    this.address = undefined;
    next();
  });
  
  
  // Reverse populate with virtuals
  UserSchema.virtual('courses', {
    ref: 'Course',
    localField: '_id',
    foreignField: 'bootcamp',
    justOne: false
  });
  
  module.exports = mongoose.model('User', UserSchema);