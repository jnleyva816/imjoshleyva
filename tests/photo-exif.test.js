import { test } from "node:test";
import assert from "node:assert/strict";
import { describeExif } from "../scripts/photo-exif.js";

test("describes a Fujifilm frame", () => {
  assert.deepEqual(
    describeExif({ Make: "FUJIFILM", Model: "X-T5", LensModel: "XF33mmF1.4 R LM WR", FocalLength: 33, FNumber: 2, ExposureTime: 1 / 250, ISO: 400 }),
    { camera: "FUJIFILM X-T5", lens: "XF33mmF1.4 R LM WR", settings: ["33mm", "ƒ/2", "1/250s", "ISO 400"] },
  );
});

test("doesn't repeat the make when the model already has it", () => {
  assert.equal(describeExif({ Make: "Canon", Model: "Canon EOS R6" }).camera, "Canon EOS R6");
});

test("long exposures read in seconds", () => {
  assert.deepEqual(describeExif({ ExposureTime: 2.5 }).settings, ["2.5s"]);
});

test("no EXIF, no description", () => {
  assert.equal(describeExif({}), null);
  assert.equal(describeExif(), null);
});
