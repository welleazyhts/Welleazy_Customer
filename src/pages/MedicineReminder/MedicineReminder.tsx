import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import './MedicineReminder.css';

const MedicineReminder: React.FC = () => {
  const [activeContent, setActiveContent] = useState<'main' | 'profile' | 'dependents' | 'addressBook'>('main');
  const [dosage, setDosage] = useState(1);
  const [duration, setDuration] = useState(1);
  const [selectedType, setSelectedType] = useState('');
  const [selectedFrequency, setSelectedFrequency] = useState('once');
  const [selectedIntake, setSelectedIntake] = useState('once');
  const navigate = useNavigate();

  // Medicine types
  const medicineTypes = [
    { label: '🧴 Syrup', value: 'syrup' },
    { label: '💊 Tablet', value: 'tablet' },
    { label: '💧 Drops', value: 'drops' },
    { label: '🫁 Inhalers', value: 'inhalers' },
    { label: '💉 Injections', value: 'injections' },
    { label: '🧴 Creams/Gel', value: 'cream' },
  ];

  // Dosage options
  const dosageOptions = [
    'Tablespoons',
    'Tablet',
    'Drops',
    'As directed by Physician'
  ];

  // Frequency options
  const frequencyOptions = [
    { label: 'One time', value: 'oneTime' },
    { label: 'Recurring', value: 'recurring' }
  ];

  // Intake options
  const intakeOptions = [
    'Once',
    'Twice',
    'Thrice',
    'Four times',
    'Every 30 minutes',
    'Hourly',
    'Every 4 hours'
  ];

  return (
    <div className="medicine-reminder">
      <main className="medicine-reminder__main">
        <div className="medicine-reminder__container">
          {activeContent === 'main' && (
            <div className="medicine-reminder__form-section">
              <h2 className="medicine-reminder__title">Medicine Reminder</h2>
              <p className="medicine-reminder__subtitle">Set reminders for your medications</p>
              
              <div className="medicine-reminder__columns">
                {/* Left Column */}
                <div className="medicine-reminder__left">
                  {/* Date Range */}
                  <div className="medicine-reminder__row">
                    <div className="medicine-reminder__field">
                      <label className="medicine-reminder__label">
                        From <span className="medicine-reminder__required">*</span>
                      </label>
                      <input 
                        type="date" 
                        className="medicine-reminder__input"
                      />
                    </div>
                    <div className="medicine-reminder__field">
                      <label className="medicine-reminder__label">
                        To <span className="medicine-reminder__required">*</span>
                      </label>
                      <input 
                        type="date" 
                        className="medicine-reminder__input"
                      />
                    </div>
                  </div>

                  {/* Medicine Name */}
                  <div className="medicine-reminder__field">
                    <label className="medicine-reminder__label">Medicine Name</label>
                    <input 
                      type="text" 
                      className="medicine-reminder__input"
                      placeholder="Enter medicine name"
                    />
                  </div>

                  {/* Type of Medicine */}
                  <div className="medicine-reminder__field">
                    <label className="medicine-reminder__label">Type of Medicine</label>
                    <input 
                      type="text" 
                      className="medicine-reminder__input"
                      placeholder="Enter type"
                    />
                  </div>

                  {/* Medicine Type Icons */}
                  <div className="medicine-reminder__field">
                    <label className="medicine-reminder__label">Select Type</label>
                    <div className="medicine-reminder__types">
                      {medicineTypes.map((type) => (
                        <button
                          key={type.value}
                          className={`medicine-reminder__type-btn ${
                            selectedType === type.value ? 'medicine-reminder__type-btn--selected' : ''
                          }`}
                          onClick={() => setSelectedType(type.value)}
                          type="button"
                        >
                          {type.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Duration */}
                  <div className="medicine-reminder__field">
                    <label className="medicine-reminder__label">Duration</label>
                    <div className="medicine-reminder__duration">
                      <div className="medicine-reminder__stepper">
                        <button 
                          type="button" 
                          className="medicine-reminder__stepper-btn"
                          onClick={() => setDuration(prev => Math.max(1, prev - 1))}
                        >
                          −
                        </button>
                        <span className="medicine-reminder__stepper-value">{duration}</span>
                        <button 
                          type="button" 
                          className="medicine-reminder__stepper-btn"
                          onClick={() => setDuration(prev => prev + 1)}
                        >
                          +
                        </button>
                      </div>
                      <span className="medicine-reminder__duration-unit">Day(s)</span>
                    </div>
                  </div>

                  {/* Dosage */}
                  <div className="medicine-reminder__field">
                    <label className="medicine-reminder__label">Dosage</label>
                    <div className="medicine-reminder__dosage-stepper">
                      <button 
                        type="button" 
                        className="medicine-reminder__stepper-btn"
                        onClick={() => setDosage(prev => Math.max(1, prev - 1))}
                      >
                        −
                      </button>
                      <span className="medicine-reminder__stepper-value">{dosage}</span>
                      <button 
                        type="button" 
                        className="medicine-reminder__stepper-btn"
                        onClick={() => setDosage(prev => prev + 1)}
                      >
                        +
                      </button>
                    </div>
                  </div>

                  {/* Doctor's Name */}
                  <div className="medicine-reminder__field">
                    <label className="medicine-reminder__label">Doctor's Name</label>
                    <input 
                      type="text" 
                      className="medicine-reminder__input"
                      placeholder="Enter doctor's name"
                    />
                  </div>

                  {/* Inventory & Reminders */}
                  <div className="medicine-reminder__field">
                    <label className="medicine-reminder__label">Refill Reminder</label>
                    <input 
                      type="text" 
                      className="medicine-reminder__input"
                      placeholder="Enter value"
                    />
                  </div>
                  <div className="medicine-reminder__field">
                    <label className="medicine-reminder__label">Remind me when</label>
                    <input 
                      type="text" 
                      className="medicine-reminder__input"
                      placeholder="Enter value"
                    />
                  </div>
                 
                </div>

                {/* Right Column */}
                <div className="medicine-reminder__right">
                  {/* Dosage Options */}
                  <div className="medicine-reminder__field">
                    <label className="medicine-reminder__group-label">Dosage Options</label>
                    <div className="medicine-reminder__options">
                      {dosageOptions.map((option, index) => (
                        <label key={index} className="medicine-reminder__option">
                          <input 
                            type="radio" 
                            name="dosage" 
                            className="medicine-reminder__radio"
                          />
                          <span className="medicine-reminder__option-text">{option}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Frequency */}
                  <div className="medicine-reminder__field">
                    <label className="medicine-reminder__group-label">Frequency</label>
                    <div className="medicine-reminder__frequency">
                      {frequencyOptions.map((option) => (
                        <label key={option.value} className="medicine-reminder__frequency-option">
                          <input 
                            type="radio" 
                            name="frequency" 
                            value={option.value}
                            checked={selectedFrequency === option.value}
                            onChange={(e) => setSelectedFrequency(e.target.value)}
                            className="medicine-reminder__radio"
                          />
                          <span className="medicine-reminder__option-text">{option.label}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Intake Time */}
                  <div className="medicine-reminder__field">
                    <label className="medicine-reminder__group-label">In-Take Time</label>
                    <div className="medicine-reminder__intake">
                      {intakeOptions.map((option, index) => (
                        <label key={index} className="medicine-reminder__intake-option">
                          <input 
                            type="radio" 
                            name="intake" 
                            value={option.toLowerCase()}
                            checked={selectedIntake === option.toLowerCase()}
                            onChange={(e) => setSelectedIntake(e.target.value)}
                            className="medicine-reminder__radio"
                          />
                          <span className="medicine-reminder__option-text">{option}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  
                  {/* Appointment Reminder */}
                  <div className="medicine-reminder__field">
                    <label className="medicine-reminder__label">
                      Appointment Reminder <span className="medicine-reminder__required">*</span>
                    </label>
                    <input 
                      type="date" 
                      className="medicine-reminder__input"
                    />
                  </div>


                   <div className="medicine-reminder__field">
                    <label className="medicine-reminder__label">Current Inventory</label>
                    <input 
                      type="text" 
                      className="medicine-reminder__input"
                      placeholder="Enter value"
                    />
                  </div>

                 

                  <div className="medicine-reminder__field">
                    <label className="medicine-reminder__label">Scheduled Time for dosage</label>
                    <input 
                      type="text" 
                      className="medicine-reminder__input"
                      placeholder="Enter time (e.g., 08:00 AM)"
                    />
                  </div>

                </div>
              </div>

              {/* Form Buttons */}
              <div className="medicine-reminder__actions">
                <button type="button" className="medicine-reminder__btn medicine-reminder__btn--save">
                  Save Reminder
                </button>
                <button 
                  type="button" 
                  className="medicine-reminder__btn medicine-reminder__btn--cancel"
                  onClick={() => navigate('/')}
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default MedicineReminder;