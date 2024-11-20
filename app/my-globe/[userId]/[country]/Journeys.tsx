import { useState } from 'react';
import { type Journey } from '../../../../migrations/00002-createTableJourneys';
import AddButton from '../../../components/AddButton';
import HorizontalDivider from '../../../components/HorizontalDivider';
import JourneyCardCompact from './JourneyCardCompact';
import JourneyForm from './JourneyForm';

type Props = {
  journeys: Journey[];
  selectedCountryAdm0A3: string;
  userId: string;
  personalGlobe: boolean;
};

type ShowJourneyForm = {
  show: boolean;
  journeyToEdit: Journey | undefined;
};

export default function Journeys({
  journeys,
  selectedCountryAdm0A3,
  userId,
  personalGlobe,
}: Props) {
  const [showJourneyForm, setShowJourneyForm] = useState<ShowJourneyForm>({
    show: false,
    journeyToEdit: undefined,
  });

  return (
    <div className="text-center">
      <h2>Journeys</h2>
      <div className="flex items-center">
        <HorizontalDivider />
        {personalGlobe && (
          <AddButton
            data-test-id="add-journey-button"
            open={showJourneyForm.show}
            onClick={() =>
              setShowJourneyForm((prev) => ({
                show: !prev.show,
                journeyToEdit: undefined,
              }))
            }
          />
        )}
        <HorizontalDivider />
      </div>
      {showJourneyForm.show && personalGlobe && (
        <div className="flex justify-center">
          <JourneyForm
            selectedCountryAdm0A3={selectedCountryAdm0A3}
            journey={showJourneyForm.journeyToEdit}
            onSubmit={() =>
              setShowJourneyForm((prev) => ({
                show: !prev.show,
                journeyToEdit: undefined,
              }))
            }
            onDelete={() =>
              setShowJourneyForm((prev) => ({
                show: !prev.show,
                journeyToEdit: undefined,
              }))
            }
          />
        </div>
      )}
      {!showJourneyForm.show &&
        journeys.map((journey, index) => {
          return (
            <div key={`journey-${journey.id}`}>
              <JourneyCardCompact
                journey={journey}
                reverse={index % 2 !== 0}
                selectedCountryAdm0A3={selectedCountryAdm0A3}
                userId={userId}
                personalGlobe={personalGlobe}
                onEdit={() =>
                  setShowJourneyForm((prev) => ({
                    show: !prev.show,
                    journeyToEdit: journey,
                  }))
                }
              />
            </div>
          );
        })}
    </div>
  );
}
