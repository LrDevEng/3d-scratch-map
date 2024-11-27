import { useEffect, useState } from 'react';
import { type Journey } from '../../../../migrations/00002-createTableJourneys';
import AddButton from '../../../components/AddButton';
import HorizontalDivider from '../../../components/HorizontalDivider';
import LoadingRing from '../../../components/LoadingRing';
import JourneyCardCompact from './JourneyCardCompact';
import JourneyForm from './JourneyForm';

type Props = {
  journeys: Journey[];
  selectedCountryAdm0A3: string;
  selectedCountryName: string;
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
  selectedCountryName,
  userId,
  personalGlobe,
}: Props) {
  const [showJourneyForm, setShowJourneyForm] = useState<ShowJourneyForm>({
    show: false,
    journeyToEdit: undefined,
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(false);
  }, [journeys]);

  return (
    <div className="text-center">
      <h2>Journeys</h2>
      <div className="flex items-center">
        <HorizontalDivider />
        {personalGlobe && (
          <AddButton
            data-test-id="add-journey-button"
            open={showJourneyForm.show}
            disabled={loading}
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

      {loading && (
        <div className="w-full flex justify-center">
          <LoadingRing />
        </div>
      )}

      {showJourneyForm.show && personalGlobe && !loading && (
        <div className="flex justify-center w-full">
          <JourneyForm
            selectedCountryAdm0A3={selectedCountryAdm0A3}
            selectedCountryName={selectedCountryName}
            journey={showJourneyForm.journeyToEdit}
            onSubmit={() => {
              setLoading(true);
              setShowJourneyForm((prev) => ({
                show: !prev.show,
                journeyToEdit: undefined,
              }));
            }}
            onDelete={() => {
              setLoading(true);
              setShowJourneyForm((prev) => ({
                show: !prev.show,
                journeyToEdit: undefined,
              }));
            }}
          />
        </div>
      )}
      {!showJourneyForm.show && journeys.length === 0 && !loading && (
        <div className="mt-4">
          <svg
            className="mx-auto"
            xmlns="http://www.w3.org/2000/svg"
            width="32"
            height="32"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#ffffff"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M12 19V6M5 12l7-7 7 7" />
          </svg>
          <h3 className="mt-2">
            First time in {selectedCountryName}? Create your new journey here.
          </h3>
        </div>
      )}
      {!showJourneyForm.show &&
        !loading &&
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
