import { css, styled, useTheme } from '@/lib/emotion';
import { Icon, Typography } from '@icgc-argo/uikit';

const ResultsDropdown = styled('div')`
	position: absolute;
	top: 36px;
	left: 0px;
	background-color: white;
	width: 248px;
	border: ${({ theme }) => `1px solid ${theme.colors.primary_4}`};
	border-top: 0px;
	border-radius: 0px 0px 8px 8px;
	z-index: 2;
	padding-top: 2px;
	box-shadow: ${({ theme }) => theme.shadows.pageElement};
`;

const NoResultsContainer = styled(Typography)`
	color: ${({ theme }) => theme.colors.primary_2};
	font-size: 14px;
	font-style: italic;
	margin: 0;
	display: flex;
	align-items: center;
	padding: 8px 0 8px 10px;
`;

const ListItem = styled(Typography)`
	word-break: break-all;
	margin: 0;
	padding: 2px 3px;
`;
const SearchResultsMenu = ({
	isLoading,
	searchData,
	onSelect,
}: {
	isLoading: boolean;
	searchData: SearchMenuDataNode[];
	onSelect: Function;
}) => {
	const theme = useTheme();

	if (isLoading) {
		return (
			<ResultsDropdown>
				<NoResultsContainer>
					<Icon
						name="spinner"
						fill={theme.colors.primary_2}
						css={css`
							margin-right: 10px;
						`}
					/>
					Loading results...
				</NoResultsContainer>
			</ResultsDropdown>
		);
	} else {
		if (!searchData || searchData.length === 0) {
			return (
				<ResultsDropdown>
					<NoResultsContainer>No results found</NoResultsContainer>
				</ResultsDropdown>
			);
		}

		return (
			<>
				<ResultsDropdown>
					{searchData.map(({ resultId, secondaryText, subText }, i) => (
						<div
							css={css`
								cursor: pointer;
								padding: 2px;
								border-bottom: 1px solid ${theme.colors.primary_4};
								&:hover {
									background-color: ${theme.colors.secondary_4};
								}
								&:last-child {
									border-bottom: 0px;
								}
							`}
							onClick={() => onSelect(resultId)}
							key={`${resultId}-${i}`}
						>
							<ListItem
								css={css`
									font-size: 11px;
									font-weight: 500;
								`}
							>
								<>
									<span style={{ fontWeight: 700 }}>{resultId} </span>
									{secondaryText && `(${secondaryText})`}
								</>
							</ListItem>
							{subText && (
								<ListItem
									css={css`
										font-size: 9px;
										font-weight: 300;
									`}
								>
									{subText}
								</ListItem>
							)}
						</div>
					))}
				</ResultsDropdown>
			</>
		);
	}
};

export default SearchResultsMenu;
