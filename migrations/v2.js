import { describe, whereFromPlugin, mutateContent, checkContent, updatePlugin, getCourse, testStopWhere, testSuccessWhere } from 'adapt-migrations';
import _ from 'lodash';

describe('Definitions - v2.2.2 to v2.2.3', async () => {
  let course, courseDefinitionsGlobals, components;

  whereFromPlugin('Definitions - from v2.2.2', { name: 'adapt-definitions', version: '<2.2.3' });

  mutateContent('Definitions - Change _words array to words', async (content) => {
    course = getCourse();
    // if (!_.has(course, '_globals._extensions._tutor')) _.set(course, '_globals._extensions._tutor', {});
    // courseDefinitionsGlobals = course._globals._extensions._tutor;
    return true;
  });
  checkContent('Definitions - check globals _tutor attribute', async content => {
    // if (courseDefinitionsGlobals === undefined) throw new Error('Definitions - globals _tutor invalid');
    return true;
  });

  updatePlugin('Definitions - update to v2.2.3', { name: 'adapt-definitions', version: '2.2.3', framework: '>=2.0.0' });

  testSuccessWhere('Definitions with empty course', {
    fromPlugins: [{ name: 'adapt-definitions', version: '2.2.2' }],
    content: [
      { _id: 'c-105', _component: 'mcq' },
      { _type: 'course' }
    ]
  });

  testSuccessWhere('Definitions with empty course globals', {
    fromPlugins: [{ name: 'adapt-definitions', version: '2.2.2' }],
    content: [
      { _type: 'course', _definitions: {} }
    ]
  });

  testStopWhere('incorrect version', {
    fromPlugins: [{ name: 'adapt-definitions', version: '2.2.3' }]
  });
});
