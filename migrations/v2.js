import { describe, whereFromPlugin, mutateContent, checkContent, updatePlugin, getCourse, testStopWhere, testSuccessWhere } from 'adapt-migrations';
import _ from 'lodash';

describe('Definitions - v2.2.2 to v2.2.3', async () => {
  let course, courseDefinitions, courseDefinitionItems;

  whereFromPlugin('Definitions - from v2.2.2', { name: 'adapt-definitions', version: '<2.2.3' });

  mutateContent('Definitions - Check for course _definitions', async (content) => {
    course = getCourse();
    if (!_.has(course, '_definitions')) _.set(course, '_definitions', {});
    courseDefinitions = course._definitions;
    return true;
  });

  mutateContent('Definitions - Check for course _definitions _items', async (content) => {
    if (!_.has(courseDefinitions, '_items')) _.set(courseDefinitions, '_items', []);
    courseDefinitionItems = course._definitions._items;
    return true;
  });

  mutateContent('Definitions - Change item _words array to words', async (content) => {
    courseDefinitionItems.forEach(item => {
      // If has _words array, rename to words
    });
    return true;
  });

  checkContent('Definitions - check course _definitions', async content => {
    if (courseDefinitions === undefined) throw new Error('Definitions - course _definitions invalid');
    return true;
  });

  checkContent('Definitions - check course _definitions _items', async content => {
    if (courseDefinitionItems === undefined) throw new Error('Definitions - course _definitions _items invalid');
    return true;
  });

  checkContent('Definitions - check item words array', async content => {
    // If has _words array, invalid
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
