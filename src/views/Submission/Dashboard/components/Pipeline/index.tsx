/*
 * Copyright (c) 2024 The Ontario Institute for Cancer Research. All rights reserved
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

import { useTheme } from '@/lib/emotion';
import { Pipe } from '@icgc-argo/uikit';

enum PIPELINE_STATUS {
	COMPLETE = 'complete',
	IN_PROGRESS = 'inProgress',
	ERROR = 'error',
}
type PipelineStats = Record<PIPELINE_STATUS, number>;

export const Pipeline = (stats: PipelineStats) => {
	const theme = useTheme();

	const getBackgroundColour = (state: keyof PipelineStats) => {
		interface ColourMapper {
			[key: string]: keyof typeof theme.colors;
		}
		const mapper: ColourMapper = {
			[PIPELINE_STATUS.COMPLETE]: 'accent1_dimmed',
			[PIPELINE_STATUS.IN_PROGRESS]: 'warning_dark',
			[PIPELINE_STATUS.ERROR]: 'error',
		};
		return mapper[state];
	};

	const shouldRender = (num: number) => num > 0;

	const renderableStats = Object.keys(stats).filter((key) => shouldRender(stats[key]));

	const pipeStats = renderableStats.map((stat) => (
		<Pipe.Item key={stat} fill={getBackgroundColour(stat as keyof PipelineStats)}>
			{stats[stat].toLocaleString()}
		</Pipe.Item>
	));
	return <Pipe>{pipeStats}</Pipe>;
};
