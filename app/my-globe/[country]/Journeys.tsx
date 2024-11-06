import { useState } from 'react';
import { type Journey } from '../../../migrations/00002-createTableJourneys';
import AddButton from '../../components/AddButton';
import HorizontalDivider from '../../components/HorizontalDivider';
import JourneyForm from './JourneyForm';

type Props = {
  journeys: Journey[];
  selectedCountryAdm0A3: string;
};

export default function Journeys({ journeys, selectedCountryAdm0A3 }: Props) {
  const [showAddJourney, setShowAddJourney] = useState(false);

  return (
    <div className="text-center">
      <h2>Journeys</h2>
      <div className="flex items-center">
        <HorizontalDivider />
        <AddButton
          open={showAddJourney}
          onClick={() => setShowAddJourney((prev) => !prev)}
        />
        <HorizontalDivider />
      </div>
      {showAddJourney && (
        <div className="flex justify-center">
          <JourneyForm
            selectedCountryAdm0A3={selectedCountryAdm0A3}
            onSubmit={() => setShowAddJourney(false)}
          />
        </div>
      )}
      {journeys.map((journey) => {
        return (
          <div key={`journey-${journey.id}`}>
            <div>{journey.title}</div>
            <div>{journey.dateStart.toDateString()}</div>
            <div>{journey.dateEnd.toDateString()}</div>
            <div>{journey.summary}</div>
          </div>
        );
      })}
    </div>
  );
}
