import TABLE_NAMES from './table-names';

const USER_GUIDE = {
  CONTACT: 'ug_contact',
  SIDEBAR_LEFT: 'ug_sidebar_left',
  SIDEBAR_LEFT_MENU_BUTTON: 'ug_sidebar_left_menu_button',
  SIDEBAR_RIGHT: 'ug_sidebar_right',
  TABLE: 'ug_table',
  TABLE_SELECT: {
    [TABLE_NAMES.JOBS]: `ug_${TABLE_NAMES.JOBS}`,
    [TABLE_NAMES.PIPELINES]: `ug_${TABLE_NAMES.PIPELINES}`,
    [TABLE_NAMES.ALGORITHMS]: `ug_${TABLE_NAMES.ALGORITHMS}`,
    [TABLE_NAMES.WORKERS]: `ug_${TABLE_NAMES.WORKERS}`,
    [TABLE_NAMES.DRIVERS]: `ug_${TABLE_NAMES.DRIVERS}`,
    [TABLE_NAMES.DEBUG]: `ug_${TABLE_NAMES.DEBUG}`,
    [TABLE_NAMES.BUILDS]: `ug_${TABLE_NAMES.BUILDS}`,
    [TABLE_NAMES.CLUSTER_STATS.CPU]: `ug_${TABLE_NAMES.CLUSTER_STATS.CPU}`,
    [TABLE_NAMES.CLUSTER_STATS.MEMORY]: `ug_${TABLE_NAMES.CLUSTER_STATS.MEMORY}`
  },
  TABLE_JOB: {
    MENU_SELECT: `ug_${TABLE_NAMES.JOBS}`,
    ID_SELECT: 'ug_job_table_id_select',
    ACTIONS_SELECT: 'ug_job_actions_select',
    ROW_SELECT: 'ug_job_row_select'
  }
};

export default USER_GUIDE;
