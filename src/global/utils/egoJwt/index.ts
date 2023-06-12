import memoize from 'lodash/memoize';

import createEgoUtils from '@icgc-argo/ego-token-utils';
import { getAppConfig } from '../../config';

const TokenUtils = createEgoUtils(getAppConfig().EGO_PUBLIC_KEY);

export const decodeToken = memoize((egoJwt?: string) =>
	egoJwt ? TokenUtils.decodeToken(egoJwt) : null,
);

export const isValidJwt = (egoJwt: string) => !!egoJwt && TokenUtils.isValidJwt(egoJwt);

export const getPermissionsFromToken: (egoJwt: string) => string[] = (egoJwt) =>
	isValidJwt(egoJwt) ? TokenUtils.getPermissionsFromToken(egoJwt) : [];
