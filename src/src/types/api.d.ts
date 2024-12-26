interface Res {
  status_code: number;
  status_msg: string;
}
interface TestReq {
  test: string;
}
interface TestRes extends Res {
  data: {
    test: number;
  };
}
export { TestReq, TestRes };
