import React from 'react';
import {
	PartialForm,
	Error,
	EntriesAsList,
	getErrorObject,
	useFormArray,
} from '@togglecorp/toggle-form';
import { listToMap } from '@togglecorp/fujs';

import RadioInput from '#components/RadioInput';
import Container from '#components/Container';
import languageContext from '#root/languageContext';
import InputSection from '#components/InputSection';
import TextArea from '#components/TextArea';
import DREFFileInput from '#components/DREFFileInput';
import { FileWithCaption } from '#views/DrefApplicationForm/common';
import CaptionInput from '#views/DrefApplicationForm/CaptionInput';

import {
	booleanOptionKeySelector,
	BooleanValueOption,
	DrefOperationalUpdateFields,
	optionLabelSelector,
} from '../common';

import styles from './styles.module.scss';
import DateInput from '#components/DateInput';

type Value = PartialForm<DrefOperationalUpdateFields>;
interface Props {
	error: Error<Value> | undefined;
	onValueChange: (...entries: EntriesAsList<Value>) => void;
	value: Value;
	yesNoOptions: BooleanValueOption[];
	isImminentOnset: boolean;
	fileIdToUrlMap: Record<number, string>;
	setFileIdToUrlMap?: React.Dispatch<React.SetStateAction<Record<number, string>>>;
	isSuddenOnset: boolean;
}

function EventDetails(props: Props) {
	const { strings } = React.useContext(languageContext);
	const {
		value,
		error: formError,
		onValueChange,
		yesNoOptions,
		isImminentOnset,
		fileIdToUrlMap,
		setFileIdToUrlMap,
		isSuddenOnset,
	} = props;
	const error = React.useMemo(
		() => getErrorObject(formError),
		[formError]
	);

	const imagesValue = React.useMemo(() => (
		value?.images_file?.map(d => d.id).filter(d => !!d) as number[] | undefined
	), [value?.images_file]);

	const {
		setValue: onImageChange,
		removeValue: onImageRemove,
	} = useFormArray<'images_file', PartialForm<FileWithCaption>>(
		'images_file',
		onValueChange,
	);
	const handleImageInputChange = React.useCallback((newValue: number[] | undefined) => {
		const imageCaptionByIdMap = listToMap(
			value?.images_file ?? [],
			img => img.id as number,
			img => img.caption,
		);

		const newImageList: undefined | PartialForm<FileWithCaption[]> = newValue?.map((v) => ({
			client_id: String(v),
			id: v,
			caption: imageCaptionByIdMap[v],
		}));

		onValueChange(newImageList, 'images_file' as const);
	}, [value?.images_file, onValueChange]);

	return (
		<>
			<Container
				heading={strings.drefOperationalUpdateSummaryChangeHeading}
			>
				<InputSection
					title={strings.drefOperationalUpdateSummaryAreYouChangingTimeFrame}
				>
					<RadioInput
						name={"changing_timeframe_operation" as const}
						options={yesNoOptions}
						keySelector={booleanOptionKeySelector}
						labelSelector={optionLabelSelector}
						value={value.changing_timeframe_operation}
						onChange={onValueChange}
						error={error?.changing_timeframe_operation}
					/>
				</InputSection>
				<InputSection
					title={strings.drefOperationalUpdateSummaryAreYouChangingStrategy}
				>
					<RadioInput
						name={"changing_operation_strategy" as const}
						options={yesNoOptions}
						keySelector={booleanOptionKeySelector}
						labelSelector={optionLabelSelector}
						value={value.changing_operation_strategy}
						onChange={onValueChange}
						error={error?.changing_operation_strategy}
					/>
				</InputSection>
				<InputSection
					title={strings.drefOperationalUpdateSummaryAreYouChangingTargetPopulation}
				>
					<RadioInput
						name={"changing_target_population_of_operation" as const}
						options={yesNoOptions}
						keySelector={booleanOptionKeySelector}
						labelSelector={optionLabelSelector}
						value={value.changing_target_population_of_operation}
						onChange={onValueChange}
						error={error?.changing_target_population_of_operation}
					/>
				</InputSection>
				<InputSection
					title={strings.drefOperationalUpdateSummaryAreYouChangingGeographicalLocation}
				>
					<RadioInput
						name={"changing_geographic_location" as const}
						options={yesNoOptions}
						keySelector={booleanOptionKeySelector}
						labelSelector={optionLabelSelector}
						value={value.changing_geographic_location}
						onChange={onValueChange}
						error={error?.changing_geographic_location}
					/>
				</InputSection>
				<InputSection
					title={strings.drefOperationalUpdateSummaryAreYouChangingBudget}
				>
					<RadioInput
						name={"changing_budget" as const}
						options={yesNoOptions}
						keySelector={booleanOptionKeySelector}
						labelSelector={optionLabelSelector}
						value={value.changing_budget}
						onChange={onValueChange}
						error={error?.changing_budget}
					/>
				</InputSection>
				<InputSection title={strings.drefOperationalUpdateSummaryRequestForSecondAllocation}>
					<RadioInput
						name={"request_for_second_allocation" as const}
						options={yesNoOptions}
						keySelector={booleanOptionKeySelector}
						labelSelector={optionLabelSelector}
						value={value.request_for_second_allocation}
						onChange={onValueChange}
						error={error?.request_for_second_allocation}
					/>
				</InputSection>

				{isImminentOnset &&
					<InputSection
						title={strings.drefOperationalUpdateEventMaterialize}
					>
						<RadioInput
							name={"has_forecasted_event_materialize" as const}
							options={yesNoOptions}
							keySelector={booleanOptionKeySelector}
							labelSelector={optionLabelSelector}
							value={value.has_forecasted_event_materialize}
							onChange={onValueChange}
							error={error?.has_forecasted_event_materialize}
						/>
					</InputSection>
				}
				{(isImminentOnset && value.has_forecasted_event_materialize)
					&&
					<InputSection
						title={strings.drefOperationalUpdateEventMaterializeExplain}
						description={strings.drefOperationalUpdateEventMaterializeExplainDescription}
					>
						<TextArea
							name="specified_trigger_met"
							value={value.specified_trigger_met}
							onChange={onValueChange}
							error={error?.specified_trigger_met}
							placeholder={strings.drefOperationalUpdateSummaryExplain}
						/>
					</InputSection>
				}
				<InputSection title={strings.drefOperationalUpdateSummaryExplain}>
					<TextArea
						name="summary_of_change"
						value={value.summary_of_change}
						onChange={onValueChange}
						error={error?.summary_of_change}
						placeholder={strings.drefOperationalUpdateSummaryExplain}
					/>
				</InputSection>

			</Container>
			<Container heading={strings.drefOperationalUpdateDescriptionOfEventHeading}>
				<InputSection
					title={
						isImminentOnset
							? strings.drefFormApproximateDateOfImpact
							: isSuddenOnset
								? strings.drefFormEventDate
								: strings.drefFormSlowEventDate
					}
				>
					{isImminentOnset ? (
						<TextArea
							name="event_text"
							value={value.event_text}
							onChange={onValueChange}
							error={error?.event_text}
						/>
					) : (
						<DateInput
							name="event_date"
							value={value.event_date}
							onChange={onValueChange}
							error={error?.event_date}
						/>
					)}
				</InputSection>
				<InputSection
					title={
						!isImminentOnset ?
							strings.drefFormWhatWhereWhen
							: strings.drefFormImminentDisaster}
					oneColumn
					multiRow
				>
					<TextArea
						name="event_description"
						onChange={onValueChange}
						value={value.event_description}
						error={error?.event_description}
					/>
				</InputSection>
				{isImminentOnset &&
					<InputSection
						title={strings.drefFormTargetCommunities}
						oneColumn
						multiRow
					>
						<TextArea
							name="anticipatory_actions"
							onChange={onValueChange}
							value={value.anticipatory_actions}
							error={error?.anticipatory_actions}
						/>
					</InputSection>
				}
				<InputSection
					title={strings.drefFormUploadPhotos}
					description={strings.drefFormUploadPhotosLimitation}
					contentSectionClassName={styles.imageInputContent}
				>
					<DREFFileInput
						name="images_file"
						value={imagesValue}
						onChange={handleImageInputChange}
						accept="image/*"
						multiple
						error={error?.images_file}
						fileIdToUrlMap={fileIdToUrlMap}
						setFileIdToUrlMap={setFileIdToUrlMap}
						hidePreview
					>
						Select images
					</DREFFileInput>
					<div className={styles.previewList}>
						{value?.images_file?.map((g, i) => (
							<CaptionInput
								key={g.client_id}
								index={i}
								value={g}
								onChange={onImageChange}
								onRemove={onImageRemove}
								error={getErrorObject(error?.images_file)}
								fileIdToUrlMap={fileIdToUrlMap}
							/>
						))}
					</div>
				</InputSection>
				<InputSection
					title={strings.drefFormScopeAndScaleEvent}
					description={strings.drefFormScopeAndScaleDescription}
					oneColumn
					multiRow
				>
					<TextArea
						name="event_scope"
						onChange={onValueChange}
						value={value.event_scope}
						error={error?.event_scope}
					/>
				</InputSection>
			</Container>
		</>
	);
}

export default EventDetails;
