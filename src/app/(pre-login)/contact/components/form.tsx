/*
 * Copyright (c) 2023 The Ontario Institute for Cancer Research. All rights reserved
 *
 * This program and the accompanying materials are made available under the terms of
 * the GNU Affero General Public License v3.0. You should have received a copy of the
 * GNU Affero General Public License along with this program.
 *  If not, see <http://www.gnu.org/licenses/>.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY
 * EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES
 * OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT
 * SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT,
 * INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED
 * TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS;
 * OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER
 * IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN
 * ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */

import { useAppConfigContext } from '@/app/components/ConfigProvider';
import { zodResolver } from '@hookform/resolvers/zod';
import {
	Button,
	ContentBox,
	FormControl,
	FormHelperText,
	Input,
	InputLabel,
	Select,
	Textarea,
	Typography,
	css,
} from '@icgc-argo/uikit';
import ReCAPTCHA from 'react-google-recaptcha';
import { Col, Row } from 'react-grid-system';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { z } from 'zod';

export const CONTACT_CATEGORY_OPTIONS = [
	{
		content: 'Applying for Access to Controlled Data through DACO',
		value: 'APPLYING_ACCESS',
	},
	{ content: 'Data Download', value: 'DATA_DOWNLOAD' },
	{ content: 'Data Submission', value: 'DATA_SUBMISSION' },
	{ content: 'Data or Analysis Query', value: 'DATA_QUERY' },
	{ content: 'Media or Collaboration Inquiry', value: 'MEDIA_QUERY' },
	{ content: 'Publication Inquiry', value: 'PUBLICATION_QUERY' },
	{ content: 'Other', value: 'OTHER' },
];

/**
 * Schema
 */
const ContactFormSchema = z.object({
	firstName: z.string().min(1, { message: 'First name is a required field.' }),
	lastName: z.string().min(1, { message: 'Last name is a required field.' }),
	email: z.string().email({ message: 'Email is a required field.' }),
	messageCategory: z.string().min(1, { message: 'Assistance Type is a required field.' }),
	messageDescription: z.string().min(1, { message: 'Your message is a required field.' }),
	reCaptcha: z.string().min(1, { message: 'Please complete the reCAPTCHA challenge.' }),
});

type ContactFormSchemaType = z.infer<typeof ContactFormSchema>;

const submitForm: SubmitHandler<ContactFormSchemaType> = async (data) => {
	console.log('[placeholder] submitting form...', data);
};

const Form = () => {
	const { RECAPTCHA_SITE_KEY } = useAppConfigContext();

	const {
		handleSubmit,
		formState: { errors, isSubmitting },
		control,
	} = useForm<ContactFormSchemaType>({
		resolver: zodResolver(ContactFormSchema),
		defaultValues: {
			firstName: '',
			lastName: '',
			email: '',
			messageCategory: '',
			messageDescription: '',
			reCaptcha: '',
		},
	});

	return (
		<Col md={12} lg={6}>
			<ContentBox
				css={css`
					margin: 30px;
					padding: 25px !important;
				`}
			>
				<Typography
					variant="title"
					css={css`
						margin-top: 0;
						margin-bottom: 25px;
					`}
				>
					Send a Message
				</Typography>
				<Typography
					css={css`
						margin-bottom: 10px;
					`}
				>
					If you still can’t find what you’re looking for, let us know how we can help:
				</Typography>
				<form name="sendMessage" onSubmit={handleSubmit(submitForm)}>
					{/** First name */}
					<Row align="center">
						<Col md={6} sm={12}>
							<FormControl required={true} error={!!errors.firstName}>
								<Row>
									<Col
										sm={5}
										css={css`
											align-self: center;
										`}
									>
										<InputLabel
											htmlFor="first-name"
											css={css`
												margin: 0;
												width: 120px;
											`}
										>
											First Name
										</InputLabel>
									</Col>
									<Col>
										<Controller
											name="firstName"
											control={control}
											render={({ field }) => (
												<Input
													css={css`
														flex-grow: 1;
													`}
													aria-label="First Name"
													id="first-name"
													{...field}
												/>
											)}
										/>

										{errors.firstName && (
											<FormHelperText>{errors.firstName?.message}</FormHelperText>
										)}
									</Col>
								</Row>
							</FormControl>
						</Col>
						{/** Last name */}
						<Col md={6} sm={12}>
							<FormControl required={true} error={!!errors.lastName}>
								<Row>
									<Col
										sm={5}
										css={css`
											align-self: center;
										`}
									>
										<InputLabel
											htmlFor="last-name"
											css={css`
												margin: 0;
												width: 120px;
											`}
										>
											Last Name
										</InputLabel>
									</Col>
									<Col>
										<Controller
											name="lastName"
											control={control}
											rules={{ required: true }}
											render={({ field }) => (
												<Input
													css={css`
														flex-grow: 1;
													`}
													aria-label="Last Name"
													id="last-name"
													{...field}
												/>
											)}
										/>
										{errors.lastName && <FormHelperText>{errors.lastName?.message}</FormHelperText>}
									</Col>
								</Row>
							</FormControl>
						</Col>
					</Row>
					{/** Email */}
					<Row>
						<Col>
							<FormControl required={true} error={!!errors.lastName}>
								<Row>
									<Col sm={2.5}>
										<InputLabel
											htmlFor="email-address"
											css={css`
												width: 120px;
												margin: 0;
											`}
										>
											Email Address
										</InputLabel>
									</Col>
									<Col>
										<Controller
											name="email"
											control={control}
											rules={{ required: true }}
											render={({ field }) => (
												<Input
													css={css`
														flex-grow: 1;
													`}
													aria-label="Email Address"
													id="email-address"
													{...field}
												/>
											)}
										/>
										{errors.email && <FormHelperText>{errors.email?.message}</FormHelperText>}
									</Col>
								</Row>
							</FormControl>
						</Col>
					</Row>
					{/** Message Category */}
					<Row>
						<Col>
							<FormControl required={true} error={!!errors.messageCategory}>
								<InputLabel htmlFor="messageCategory">What do you need assistance with?</InputLabel>

								<Controller
									name="messageCategory"
									control={control}
									rules={{ required: true }}
									render={({ field }) => (
										<Select
											size="lg"
											aria-label="What do you need assistance with"
											id="assistance-type"
											css={css`
												margin-top: 6px;
												margin-bottom: 16px;
												svg {
													box-sizing: content-box;
												}
											`}
											options={CONTACT_CATEGORY_OPTIONS}
											{...field}
										/>
									)}
								/>

								{errors.messageCategory && (
									<FormHelperText>{errors.messageCategory?.message}</FormHelperText>
								)}
							</FormControl>
						</Col>
					</Row>
					{/** Message */}
					<Row>
						<Col>
							<FormControl required={true} error={!!errors.messageDescription}>
								<InputLabel htmlFor="messageDescription">Your message</InputLabel>
								<Controller
									name="messageDescription"
									control={control}
									rules={{ required: true }}
									render={({ field }) => (
										<Textarea
											aria-label="Your message"
											id="message"
											css={css`
												margin-top: 6px;
												margin-bottom: 0px;
												height: 115px;
											`}
											{...field}
										/>
									)}
								/>

								{errors.messageDescription && (
									<FormHelperText>{errors.messageDescription?.message}</FormHelperText>
								)}
							</FormControl>
						</Col>
					</Row>
					<Row align="end">
						<Col>
							<FormControl required={true} error={!!errors.reCaptcha}>
								<Controller
									name="reCaptcha"
									control={control}
									rules={{ required: true }}
									render={({ field }) => {
										/** @ts-expect-error 3rd party recaptcha comp onChange event type is more closed than react-hook-form onChange */
										return <ReCAPTCHA sitekey={RECAPTCHA_SITE_KEY} {...field} />;
									}}
								/>
								{errors.reCaptcha && <FormHelperText>{errors.reCaptcha?.message}</FormHelperText>}
							</FormControl>
						</Col>
					</Row>
					<Button
						type="submit"
						css={css`
							margin-left: auto;
							margin-right: 0px;
						`}
						disabled={isSubmitting}
					>
						SEND MESSAGE
					</Button>
				</form>
			</ContentBox>
		</Col>
	);
};

export default Form;
