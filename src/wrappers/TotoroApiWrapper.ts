import type BasicRequest from '../types/requestTypes/BasicRequest';
import type GetSchoolMonthByTermRequest from '../types/requestTypes/GetSchoolMonthByTermRequest';
import type GetSchoolTermRequest from '../types/requestTypes/GetSchoolTermRequest';
import type GetSunRunArchDetailRequest from '../types/requestTypes/GetSunRunArchDetailRequest';
import type GetSunRunArchRequest from '../types/requestTypes/GetSunRunArchRequest';
import type SunRunExercisesDetailRequest from '../types/requestTypes/SunRunExercisesDetailRequest';
import type SunRunExercisesRequest from '../types/requestTypes/SunRunExercisesRequest';
import type UpdateAppVersionRequest from '../types/requestTypes/UpdateAppVersionRequest';
import type GetAppAdResponse from '../types/responseTypes/GetAppAdResponse';
import type GetAppFrontPageResponse from '../types/responseTypes/GetAppFrontPageResponse';
import type GetAppNoticeResponse from '../types/responseTypes/GetAppNoticeResponse';
import type GetAppSloganResponse from '../types/responseTypes/GetAppSloganResponse';
import type GetLesseeServerResponse from '../types/responseTypes/GetLesseeServerResponse';
import type GetRegisterUrlResponse from '../types/responseTypes/GetRegisterUrlResponse';
import type GetRunBeginResponse from '../types/responseTypes/GetRunBeginResponse';
import type GetSchoolMonthByTermResponse from '../types/responseTypes/GetSchoolMonthByTermResponse';
import type GetSchoolTermResponse from '../types/responseTypes/GetSchoolTermResponse';
import type GetSunRunArchDetailResponse from '../types/responseTypes/GetSunRunArchDetailResponse';
import type GetSunRunArchResponse from '../types/responseTypes/GetSunRunArchResponse';
import type GetSunRunPaperResponse from '../types/responseTypes/GetSunRunPaperResponse';
import type LoginResponse from '../types/responseTypes/LoginResponse';
import type SunRunExercisesDetailResponse from '../types/responseTypes/SunRunExercisesDetailResponse';
import type SunRunExercisesResponse from '../types/responseTypes/SunRunExercisesResponse';
import type UpdateAppVersionResponse from '../types/responseTypes/UpdateAppVersionResponse';
import type { Point } from '../types/RunPoint';
import ky from 'ky';
import encryptRequestContent from '../utils/encryptRequestContent';

const client = ky.create({
  prefixUrl: '/api/totoro',
  headers: {
    'Content-Type': 'text/plain; charset=utf-8',
    // "Content-Length": "0",
    Host: 'app.xtotoro.com',
    Connection: 'Keep-Alive',
    'Accept-Encoding': 'gzip',
    'User-Agent': 'okhttp/4.9.0',
  },
});

/** POST an RSA-encrypted JSON body to the Totoro proxy and parse the JSON response. */
function postEncrypted<T>(path: string, req: Record<string, any>): Promise<T> {
  return client.post(path, { body: encryptRequestContent(req) }).json<T>();
}

const TotoroApiWrapper = {
  async getRegisterUrl() {
    return client.post('platform/serverlist/getRegisterUrl').json<GetRegisterUrlResponse>();
  },

  async getLesseeServer(code: string) {
    return postEncrypted<GetLesseeServerResponse>('platform/serverlist/getLesseeServer', { code });
  },

  async getAppAd(code: string) {
    return postEncrypted<GetAppAdResponse>('platform/serverlist/getAppAd', { code });
  },

  async login({ token }: { token: string }) {
    return postEncrypted<LoginResponse>('platform/login/login', {
      code: '',
      latitude: '',
      loginWay: '',
      longitude: '',
      password: '',
      phoneNumber: '',
      token,
    });
  },

  async getAppSlogan(req: BasicRequest): Promise<GetAppSloganResponse> {
    return postEncrypted('platform/serverlist/getAppSlogan', req);
  },

  async getAppFrontPage(req: BasicRequest): Promise<GetAppFrontPageResponse> {
    return postEncrypted('platform/login/getAppFrontPage', req);
  },

  async updateAppVersion(breq: BasicRequest): Promise<UpdateAppVersionResponse> {
    const req: UpdateAppVersionRequest = {
      campusId: breq.campusId,
      schoolId: breq.schoolId,
      token: breq.token,
      version: '1.2.14',
      deviceType: '2',
      stuNumber: breq.stuNumber,
    };
    return postEncrypted('platform/serverlist/updateAppVersion', req);
  },

  async getAppNotice(req: BasicRequest): Promise<GetAppNoticeResponse> {
    return postEncrypted('platform/serverlist/getAppNotice', { ...req, version: '' });
  },

  async getSunRunPaper(req: BasicRequest): Promise<GetSunRunPaperResponse> {
    return postEncrypted('sunrun/getSunrunPaper', req);
  },

  async getRunBegin(req: BasicRequest) {
    return postEncrypted<GetRunBeginResponse>('sunrun/getRunBegin', req);
  },

  async sunRunExercises(req: SunRunExercisesRequest): Promise<SunRunExercisesResponse> {
    return postEncrypted('platform/recrecord/sunRunExercises', req);
  },

  async sunRunExercisesDetail({
    pointList,
    scantronId,
    breq,
  }: {
    pointList: Point[];
    scantronId: string;
    breq: BasicRequest;
  }) {
    const req: SunRunExercisesDetailRequest = {
      pointList,
      scantronId,
      stuNumber: breq.stuNumber,
      token: breq.token,
    };
    return client
      .post('platform/recrecord/sunRunExercisesDetail', { json: req })
      .json<SunRunExercisesDetailResponse>();
  },

  async getSchoolTerm(breq: BasicRequest): Promise<GetSchoolTermResponse> {
    const req: GetSchoolTermRequest = {
      schoolId: breq.schoolId,
      token: breq.token,
    };
    return postEncrypted('platform/course/getSchoolTerm', req);
  },

  async getSchoolMonthByTerm(
    termId: string,
    breq: BasicRequest,
  ): Promise<GetSchoolMonthByTermResponse> {
    const req: GetSchoolMonthByTermRequest = {
      schoolId: breq.schoolId,
      stuNumber: breq.stuNumber,
      token: breq.token,
      termId,
    };
    return postEncrypted('platform/course/getSchoolMonthByTerm', req);
  },

  async getSunRunArch(
    monthId: string,
    termId: string,
    breq: BasicRequest,
  ): Promise<GetSunRunArchResponse> {
    const req: GetSunRunArchRequest = {
      ...breq,
      runType: '0',
      monthId,
      termId,
    };
    return postEncrypted('sunrun/getSunrunArch', req);
  },

  async getSunRunArchDetail(
    scoreId: string,
    breq: BasicRequest,
  ): Promise<GetSunRunArchDetailResponse> {
    const req: GetSunRunArchDetailRequest = {
      scoreId,
      token: breq.token,
    };
    return postEncrypted('sunrun/getSunrunArchDetail', req);
  },
};

export default TotoroApiWrapper;
